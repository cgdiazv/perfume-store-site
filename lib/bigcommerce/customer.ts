import { BIGCOMMERCE_API_URL } from './constants';

export type UpdateProfileParams = {
  customerId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
};

export type UpdateAddressParams = {
  addressId?: number;
  customerId: number;
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

export async function updateCustomerProfile(params: UpdateProfileParams) {
  if (!process.env.BIGCOMMERCE_ACCESS_TOKEN || !process.env.BIGCOMMERCE_STORE_HASH) {
    throw new Error('BigCommerce admin credentials are not configured.');
  }

  const response = await fetch(
    `${BIGCOMMERCE_API_URL}/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/customers`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': process.env.BIGCOMMERCE_ACCESS_TOKEN
      },
      body: JSON.stringify([
        {
          id: params.customerId,
          first_name: params.firstName,
          last_name: params.lastName,
          phone: params.phone || '',
          company: params.company || ''
        }
      ])
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload?.title ||
      payload?.message ||
      payload?.errors?.[0]?.message ||
      'Failed to update customer profile.';
    throw new Error(message);
  }

  return payload;
}

export async function saveCustomerAddress(params: UpdateAddressParams) {
  if (!process.env.BIGCOMMERCE_ACCESS_TOKEN || !process.env.BIGCOMMERCE_STORE_HASH) {
    throw new Error('BigCommerce admin credentials are not configured.');
  }

  const isUpdate = Boolean(params.addressId);
  const url = `${BIGCOMMERCE_API_URL}/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/customers/addresses`;
  const method = isUpdate ? 'PUT' : 'POST';

  const bodyPayload = isUpdate
    ? [
        {
          id: params.addressId,
          first_name: params.firstName,
          last_name: params.lastName,
          address1: params.address1,
          address2: params.address2 || '',
          city: params.city,
          state_or_province: params.stateOrProvince,
          postal_code: params.postalCode,
          country_code: params.countryCode,
          phone: params.phone || ''
        }
      ]
    : [
        {
          customer_id: params.customerId,
          first_name: params.firstName,
          last_name: params.lastName,
          address1: params.address1,
          address2: params.address2 || '',
          city: params.city,
          state_or_province: params.stateOrProvince,
          postal_code: params.postalCode,
          country_code: params.countryCode,
          phone: params.phone || ''
        }
      ];

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': process.env.BIGCOMMERCE_ACCESS_TOKEN
    },
    body: JSON.stringify(bodyPayload)
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload?.title ||
      payload?.message ||
      payload?.errors?.[0]?.message ||
      'Failed to save customer address.';
    throw new Error(message);
  }

  return payload;
}
