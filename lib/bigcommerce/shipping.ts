import { BIGCOMMERCE_API_URL } from './constants';

export type ShippingAddressInput = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
};

export type AvailableShippingOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  type?: string;
  transitTime?: string;
};

const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;

/**
 * Creates or updates a shipping consignment for a BigCommerce checkout
 * and retrieves available dynamic shipping rates.
 */
export async function createOrUpdateCheckoutConsignment({
  checkoutId,
  shippingAddress
}: {
  checkoutId: string;
  shippingAddress: ShippingAddressInput;
}): Promise<{
  consignmentId: string;
  shippingOptions: AvailableShippingOption[];
}> {
  if (!storeHash || !accessToken) {
    throw new Error('BigCommerce store credentials are missing');
  }

  // 1. Fetch cart to retrieve physical line item IDs
  const cartRes = await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/carts/${checkoutId}`, {
    headers: {
      'X-Auth-Token': accessToken,
      Accept: 'application/json'
    },
    cache: 'no-store'
  });

  if (!cartRes.ok) {
    const errorText = await cartRes.text();
    throw new Error(`Failed to fetch cart for checkout ${checkoutId}: ${errorText}`);
  }

  const cartData = await cartRes.json();
  const physicalItems = cartData.data?.line_items?.physical_items || [];

  if (physicalItems.length === 0) {
    return { consignmentId: '', shippingOptions: [] };
  }

  const lineItemsPayload = physicalItems.map((item: any) => ({
    item_id: item.id,
    quantity: item.quantity
  }));

  // 2. Check existing checkout consignments
  const checkoutRes = await fetch(
    `${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/checkouts/${checkoutId}?include=consignments.available_shipping_options`,
    {
      headers: {
        'X-Auth-Token': accessToken,
        Accept: 'application/json'
      },
      cache: 'no-store'
    }
  );

  let existingConsignmentId: string | null = null;
  if (checkoutRes.ok) {
    const existingCheckout = await checkoutRes.json();
    if (existingCheckout.data?.consignments?.length > 0) {
      existingConsignmentId = existingCheckout.data.consignments[0].id;
    }
  }

  const formattedAddress = {
    first_name: shippingAddress.firstName,
    last_name: shippingAddress.lastName,
    address1: shippingAddress.address1,
    address2: shippingAddress.address2 || '',
    city: shippingAddress.city,
    state_or_province: shippingAddress.stateOrProvince,
    postal_code: shippingAddress.postalCode,
    country_code: shippingAddress.countryCode || 'US',
    phone: shippingAddress.phone || ''
  };

  let res: Response;
  if (existingConsignmentId) {
    // Update existing consignment
    res = await fetch(
      `${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/checkouts/${checkoutId}/consignments/${existingConsignmentId}?include=consignments.available_shipping_options`,
      {
        method: 'PUT',
        headers: {
          'X-Auth-Token': accessToken,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          shipping_address: formattedAddress,
          line_items: lineItemsPayload
        }),
        cache: 'no-store'
      }
    );
  } else {
    // Create new consignment
    res = await fetch(
      `${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/checkouts/${checkoutId}/consignments?include=consignments.available_shipping_options`,
      {
        method: 'POST',
        headers: {
          'X-Auth-Token': accessToken,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify([
          {
            shipping_address: formattedAddress,
            line_items: lineItemsPayload
          }
        ]),
        cache: 'no-store'
      }
    );
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`BigCommerce Consignment Error: ${errText}`);
  }

  const data = await res.json();
  const consignment = data.data?.consignments?.[0];

  if (!consignment) {
    return { consignmentId: '', shippingOptions: [] };
  }

  const rawOptions = consignment.available_shipping_options || [];
  const shippingOptions: AvailableShippingOption[] = rawOptions.map((opt: any) => ({
    id: opt.id,
    name: opt.description || 'Standard Shipping',
    description: opt.transit_time ? `Est. Transit: ${opt.transit_time}` : (opt.additional_description || 'Calculated live rate'),
    price: typeof opt.cost_after_discount === 'number' ? opt.cost_after_discount : (opt.cost || 0),
    type: opt.type,
    transitTime: opt.transit_time
  }));

  return {
    consignmentId: consignment.id,
    shippingOptions
  };
}

/**
 * Selects a shipping option on a checkout consignment in BigCommerce
 */
export async function updateConsignmentShippingOption({
  checkoutId,
  consignmentId,
  shippingOptionId
}: {
  checkoutId: string;
  consignmentId: string;
  shippingOptionId: string;
}): Promise<{
  subtotal: number;
  shippingCost: number;
  taxTotal: number;
  grandTotal: number;
}> {
  if (!storeHash || !accessToken) {
    throw new Error('BigCommerce store credentials are missing');
  }

  const res = await fetch(
    `${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/checkouts/${checkoutId}/consignments/${consignmentId}?include=consignments.available_shipping_options`,
    {
      method: 'PUT',
      headers: {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        shipping_option_id: shippingOptionId
      }),
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`BigCommerce Shipping Option Selection Error: ${errText}`);
  }

  const data = await res.json();
  const checkout = data.data;

  return {
    subtotal: checkout?.subtotal_inc_tax || checkout?.subtotal_ex_tax || 0,
    shippingCost: checkout?.shipping_cost_total_inc_tax || checkout?.shipping_cost_total_ex_tax || 0,
    taxTotal: checkout?.tax_total || 0,
    grandTotal: checkout?.grand_total || 0
  };
}
