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
    id: 'authorizenet',
    name: 'Authorize.Net',
    type: 'option',
    description: 'Secure credit or debit card payment via Authorize.Net'
  },
  {
    id: 'bankdeposit',
    name: 'Bank Deposit',
    type: 'offline',
    description: 'Direct wire transfer or bank deposit'
  },
  {
    id: 'instore',
    name: 'Pay In-Store',
    type: 'offline',
    description: 'Pay in person at the store upon pickup'
  }
];

function getMethodDescription(code: string, name: string): string {
  switch (code.toLowerCase()) {
    case 'authorizenet':
      return 'Secure credit or debit card payment via Authorize.Net';
    case 'bankdeposit':
      return 'Direct wire transfer or bank deposit';
    case 'instore':
      return 'Pay in person at the store upon pickup';
    case 'cod':
      return 'Pay upon delivery';
    case 'credit_card':
      return 'Secure credit or debit card payment';
    case 'paypal':
      return 'Pay securely via PayPal';
    default:
      return `${name} payment`;
  }
}

/**
 * Fetches available payment methods for the store or a specific checkout from BigCommerce.
 * Checks v3 payments API when checkoutId is present, and falls back to v2 payments methods
 * so that active gateways (Authorize.Net, Bank Deposit, Pay In-Store, etc.) are always dynamic.
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

  // 1. If checkoutId is provided, try BigCommerce v3 Payments Methods endpoint
  if (checkoutId) {
    try {
      const v3Url = new URL(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v3/payments/methods`);
      v3Url.searchParams.append('checkout_id', checkoutId);

      const res = await fetch(v3Url.toString(), {
        headers: {
          'X-Auth-Token': accessToken,
          Accept: 'application/json'
        },
        cache: 'no-store'
      });

      if (res.ok) {
        const json = await res.json();
        const rawMethods = json.data || [];

        if (rawMethods.length > 0) {
          return rawMethods.map((m: any) => ({
            id: m.id || m.code || 'unknown',
            name: m.name || m.title || 'Payment Method',
            type: m.type || 'option',
            testMode: !!m.test_mode,
            description: m.description || getMethodDescription(m.id || m.code, m.name || m.title)
          }));
        }
      }
    } catch (v3Error) {
      console.warn('BigCommerce v3 Payments API error, falling back to v2:', v3Error);
    }
  }

  // 2. Query BigCommerce v2 Payments Methods (returns all active store-level gateways)
  try {
    const v2Url = `${BIGCOMMERCE_API_URL}/stores/${storeHash}/v2/payments/methods`;
    const res = await fetch(v2Url, {
      headers: {
        'X-Auth-Token': accessToken,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const rawMethods = await res.json();

      if (Array.isArray(rawMethods) && rawMethods.length > 0) {
        // Filter out gift certificates & store credit since they are applied as credit adjustments
        const storeGateways = rawMethods.filter(
          (m: any) =>
            m.code !== 'bigcommerce_gift_certificate' && m.code !== 'bigcommerce_store_credit'
        );

        if (storeGateways.length > 0) {
          return storeGateways.map((m: any) => {
            const code = (m.code || '').toLowerCase();
            const isCard =
              code === 'authorizenet' ||
              code.includes('card') ||
              code.includes('stripe') ||
              code.includes('braintree') ||
              code.includes('square');

            return {
              id: m.code,
              name: m.name || 'Payment Method',
              type: isCard ? 'option' : 'offline',
              testMode: !!m.test_mode,
              description: getMethodDescription(m.code, m.name)
            };
          });
        }
      }
    } else {
      console.warn(`BigCommerce v2 Payments API warning (${res.status}): ${await res.text()}`);
    }
  } catch (v2Error) {
    console.error('Error fetching v2 payment methods from BigCommerce:', v2Error);
  }

  // 3. Fallback to default methods if neither endpoint succeeds
  return DEFAULT_PAYMENT_METHODS;
}
