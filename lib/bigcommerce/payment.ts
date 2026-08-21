import { BIGCOMMERCE_API_URL } from './constants';

export type AvailablePaymentMethod = {
  id: string;
  name: string;
  type: string; // 'option' | 'offline' | 'hosted' | 'custom'
  testMode?: boolean;
  description?: string;
};

const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;

// Fallback payment methods if store credentials are missing or API returns empty list
export const DEFAULT_PAYMENT_METHODS: AvailablePaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Credit / Debit Card',
    type: 'option',
    description: 'Secure credit or debit card payment'
  },
  {
    id: 'bankdeposit',
    name: 'Bank Deposit',
    type: 'offline',
    description: 'Direct wire transfer or bank deposit'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    type: 'offline',
    description: 'Pay upon delivery'
  }
];

/**
 * Fetches available payment methods for the store or a specific checkout from BigCommerce.
 * Endpoint: GET /stores/{store_hash}/v3/payments/methods
 */
export async function getCheckoutPaymentMethods({
  checkoutId
}: {
  checkoutId?: string;
} = {}): Promise<AvailablePaymentMethod[]> {
  if (!storeHash || !accessToken) {
    console.warn('BigCommerce store credentials missing. Returning default payment methods.');
    return DEFAULT_PAYMENT_METHODS;
  }

  try {
    const url = new URL(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/payments/methods`);
    if (checkoutId) {
      url.searchParams.append('checkout_id', checkoutId);
    }

    const res = await fetch(url.toString(), {
      headers: {
        'X-Auth-Token': accessToken,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn(`BigCommerce Payments API warning (${res.status}): ${await res.text()}`);
      return DEFAULT_PAYMENT_METHODS;
    }

    const json = await res.json();
    const rawMethods = json.data || [];

    if (rawMethods.length === 0) {
      return DEFAULT_PAYMENT_METHODS;
    }

    const paymentMethods: AvailablePaymentMethod[] = rawMethods.map((m: any) => ({
      id: m.id || m.code || 'unknown',
      name: m.name || m.title || 'Payment Method',
      type: m.type || 'option',
      testMode: !!m.test_mode,
      description: m.description || (m.type === 'offline' ? 'Offline Payment' : 'Online Payment')
    }));

    return paymentMethods;
  } catch (error) {
    console.error('Error fetching payment methods from BigCommerce:', error);
    return DEFAULT_PAYMENT_METHODS;
  }
}
