import { BIGCOMMERCE_API_URL } from './constants';
import { ShippingAddressInput } from './shipping';

const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;

export type CreateOrderInput = {
  checkoutId: string;
  customerEmail: string;
  customerId?: number;
  shippingAddress: ShippingAddressInput & { email?: string; company?: string };
  billingAddress: ShippingAddressInput & { email?: string; company?: string };
  shippingMethodId?: string;
  paymentMethodId: string;
  paymentMethodName: string;
  orderComments?: string;
  couponCode?: string;
  cardInfo?: {
    number: string;
    expiry: string;
    cvc: string;
  };
};

export type CreateOrderResult = {
  success: boolean;
  orderId?: number;
  error?: string;
};

/**
 * Maps payment method to appropriate BigCommerce order status ID:
 * 7 = Awaiting Payment (Bank deposit, wire, etc.)
 * 8 = Awaiting Pickup (Pay in-store)
 * 11 = Awaiting Fulfillment (Credit card / Authorize.Net)
 */
function getOrderStatusId(paymentMethodId: string): number {
  const method = (paymentMethodId || '').toLowerCase();
  if (method === 'instore') {
    return 8; // Awaiting Pickup
  }
  if (method === 'bankdeposit' || method === 'cod') {
    return 7; // Awaiting Payment
  }
  if (method === 'authorizenet' || method.includes('card')) {
    return 11; // Awaiting Fulfillment
  }
  return 7; // Default: Awaiting Payment
}

/**
 * Creates a real order in BigCommerce.
 * First tries the V3 Checkout-to-Order endpoint.
 * If the checkout lacks required v3 consignment structures, falls back to V2 Orders endpoint
 * to guarantee the order is successfully placed in the BigCommerce control panel.
 */
export async function createBigCommerceOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!storeHash || !accessToken) {
    throw new Error('BigCommerce store credentials missing.');
  }

  const {
    checkoutId,
    customerEmail,
    customerId = 0,
    shippingAddress,
    billingAddress,
    paymentMethodId,
    paymentMethodName,
    orderComments = ''
  } = input;

  const email = customerEmail || billingAddress.email || shippingAddress.email || 'customer@store.local';
  const statusId = getOrderStatusId(paymentMethodId);

  // 1. Attempt V3 Checkout conversion:
  try {
    // Add / update billing address on checkout
    const billingPayload = {
      first_name: billingAddress.firstName || shippingAddress.firstName || 'Customer',
      last_name: billingAddress.lastName || shippingAddress.lastName || 'Valued',
      email: email,
      address1: billingAddress.address1 || shippingAddress.address1,
      address2: billingAddress.address2 || shippingAddress.address2 || '',
      city: billingAddress.city || shippingAddress.city,
      state_or_province: billingAddress.stateOrProvince || shippingAddress.stateOrProvince,
      postal_code: billingAddress.postalCode || shippingAddress.postalCode,
      country_code: billingAddress.countryCode || shippingAddress.countryCode || 'US',
      phone: billingAddress.phone || shippingAddress.phone || ''
    };

    await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/checkouts/${checkoutId}/billing-address`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(billingPayload),
      cache: 'no-store'
    });

    // Attempt to convert checkout into order
    const orderRes = await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/checkouts/${checkoutId}/orders`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        customer_message: orderComments
      }),
      cache: 'no-store'
    });

    if (orderRes.ok) {
      const orderJson = await orderRes.json();
      const orderId = orderJson.data?.id;

      if (orderId) {
        // Update order with payment method and status in BigCommerce
        await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v2/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'X-Auth-Token': accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            status_id: statusId,
            payment_method: paymentMethodName,
            customer_message: orderComments
          }),
          cache: 'no-store'
        });

        return { success: true, orderId };
      }
    } else {
      const errorText = await orderRes.text();
      console.warn(`BigCommerce v3 checkout order failed (${orderRes.status}): ${errorText}. Attempting v2 fallback.`);
    }
  } catch (v3Err) {
    console.warn('V3 checkout order creation error:', v3Err);
  }

  // 2. Fallback: Direct V2 Orders API using cart line items
  try {
    const cartRes = await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/carts/${checkoutId}`, {
      headers: {
        'X-Auth-Token': accessToken,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    if (!cartRes.ok) {
      const cartError = await cartRes.text();
      throw new Error(`Failed to load cart items for order creation: ${cartError}`);
    }

    const cartJson = await cartRes.json();
    const lineItems = cartJson.data?.line_items;
    const physicalItems = lineItems?.physical_items || [];
    const digitalItems = lineItems?.digital_items || [];
    const allItems = [...physicalItems, ...digitalItems];

    if (allItems.length === 0) {
      throw new Error('Cart has no items to place order.');
    }

    const products = allItems.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      variant_id: item.variant_id || undefined
    }));

    const v2OrderPayload: any = {
      customer_id: customerId,
      status_id: statusId,
      payment_method: paymentMethodName,
      customer_message: orderComments,
      billing_address: {
        first_name: billingAddress.firstName || shippingAddress.firstName || 'Customer',
        last_name: billingAddress.lastName || shippingAddress.lastName || 'Valued',
        street_1: billingAddress.address1 || shippingAddress.address1,
        street_2: billingAddress.address2 || shippingAddress.address2 || '',
        city: billingAddress.city || shippingAddress.city,
        state: billingAddress.stateOrProvince || shippingAddress.stateOrProvince,
        zip: billingAddress.postalCode || shippingAddress.postalCode,
        country_iso2: billingAddress.countryCode || shippingAddress.countryCode || 'US',
        phone: billingAddress.phone || shippingAddress.phone || '',
        email: email
      },
      shipping_addresses: [
        {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          street_1: shippingAddress.address1,
          street_2: shippingAddress.address2 || '',
          city: shippingAddress.city,
          state: shippingAddress.stateOrProvince,
          zip: shippingAddress.postalCode,
          country_iso2: shippingAddress.countryCode || 'US',
          phone: shippingAddress.phone || '',
          email: email
        }
      ],
      products
    };

    const v2Res = await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v2/orders`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(v2OrderPayload),
      cache: 'no-store'
    });

    if (!v2Res.ok) {
      const v2Error = await v2Res.text();
      throw new Error(`BigCommerce order creation failed (${v2Res.status}): ${v2Error}`);
    }

    const createdOrder = await v2Res.json();
    const orderId = createdOrder?.id;

    // Delete the cart now that order is generated
    try {
      await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/carts/${checkoutId}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': accessToken }
      });
    } catch (_) {}

    return { success: true, orderId };
  } catch (v2Err: any) {
    console.error('Failed to create order via v2 fallback:', v2Err);
    return {
      success: false,
      error: v2Err?.message || 'Failed to place order in BigCommerce.'
    };
  }
}
