import { cookies } from 'next/headers';

export function isCustomerLoggedIn() {
  return Boolean(cookies().get('bc_customer_token')?.value);
}
