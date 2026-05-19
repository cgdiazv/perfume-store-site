import CheckoutMasterForm from 'components/checkout/checkout-form';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Checkout | Premium Perfume Store',
  robots: { index: false, follow: false } // Keep automated index bots out of secure processing pages
};

interface CheckoutPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const cartId = params.id as string;

  // Safe fallback guard step: if the cart is missing or expired, bounce them back out to shop catalog pages safely
  if (!cartId) {
    redirect('/search');
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-16 pt-24 dark:bg-neutral-900/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-2xl font-bold uppercase tracking-wide text-black">
            Secure Checkout
          </h1>
          <p className="mt-2 text-sm tracking-wide text-neutral-500">
            Complete your order details below to finalize your luxury fragrance purchase.
          </p>
        </div>

        {/* Mount your master 3-step form engine, cleanly injecting your active BigCommerce cart reference id */}
        <CheckoutMasterForm initialCheckoutId={cartId} />
      </div>
    </div>
  );
}
