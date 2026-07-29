import { isCustomerLoggedIn } from 'lib/auth';
import { getCart } from 'lib/bigcommerce';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const cartId = cookies().get('cartId')?.value;
  const isLoggedIn = isCustomerLoggedIn();
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }
  return <CartModal cart={cart} isLoggedIn={isLoggedIn} />;
}
