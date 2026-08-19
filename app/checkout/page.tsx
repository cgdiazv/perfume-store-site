import CheckoutMasterForm from 'components/checkout/checkout-form';
import { isCustomerLoggedIn } from 'lib/auth';
import { getCustomer } from 'lib/bigcommerce';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Wholesale Checkout | Premium Perfume Distribution',
  robots: { index: false, follow: false } // Keep automated index bots out of secure processing pages
};

interface CheckoutPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const cartId = params.id as string;
  const showPrices = isCustomerLoggedIn();

  const customerToken = cookies().get('bc_customer_token')?.value;
  let customer = null;

  if (customerToken) {
    customer = await getCustomer(customerToken);
  }

  // Safe fallback guard step: if the cart is missing or expired, bounce them back out to shop catalog pages safely
  if (!cartId) {
    redirect('/search');
  }

  const savedAddresses =
    customer?.addresses?.edges?.map(({ node }) => ({
      id: String(node.entityId),
      firstName: node.firstName,
      lastName: node.lastName,
      phone: node.phone || '',
      address1: node.address1,
      address2: node.address2 || '',
      city: node.city,
      stateOrProvince: node.stateOrProvince,
      postalCode: node.postalCode,
      countryCode: node.countryCode,
      country: node.countryCode === 'US' ? 'United States' : node.countryCode
    })) || [];

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-16 pt-24 dark:bg-[#12100e]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-2xl font-bold uppercase tracking-wide text-black dark:text-white">
            Secure Checkout
          </h1>
          <p className="mt-2 text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
            Complete your wholesale order details below to finalize your distribution purchase.
          </p>
        </div>

        {/* Mount master 3-step form engine with customer saved addresses */}
        <CheckoutMasterForm
          initialCheckoutId={cartId}
          showPrices={showPrices}
          savedAddresses={savedAddresses}
        />
      </div>
    </div>
  );
}
