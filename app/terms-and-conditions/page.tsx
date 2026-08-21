import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Perfume Store',
  description: 'Read the Terms and Conditions for ordering wholesale and luxury fragrance products from Perfume Store.'
};

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 dark:text-neutral-200">
      {/* Header Banner */}
      <div className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-800">
        <h1 className="font-sans text-3xl font-bold uppercase tracking-wider text-black dark:text-white sm:text-4xl">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Last Updated: August 21, 2026
        </p>
      </div>

      {/* Content Body */}
      <div className="space-y-8 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
            1. Overview & Agreement
          </h2>
          <p>
            Welcome to Perfume Store. By accessing our website, placing an order, or utilizing our wholesale and retail services, you agree to be bound by these Terms and Conditions. Please read them carefully before making a transaction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
            2. Product Authenticity & Pricing
          </h2>
          <p>
            All products listed on Perfume Store are 100% genuine luxury fragrances and body oils. Prices and product availability are subject to change without prior notice. Wholesale rates and tier discounts apply based on customer credentials and store account verification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
            3. Order Placement & Acceptance
          </h2>
          <p>
            An order confirmation email does not signify our final acceptance of your order. We reserve the right to cancel or limit quantity on any order for reasons including, but not limited to, suspected fraudulent transactions, stock unavailability, or pricing errors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
            4. Shipping & Delivery Policies
          </h2>
          <p>
            Shipping options and carrier rates are calculated dynamically based on destination address and order weight. Delivery estimates provided at checkout are non-binding carrier estimates. Risk of loss passes to the purchaser upon carrier package pickup.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
            5. Returns & Damaged Goods
          </h2>
          <p>
            Unopened items in original condition may be returned within 14 days of delivery. Due to health and hygiene standards, opened cosmetic or fragrance products cannot be returned unless damaged in transit. Damaged items must be reported within 48 hours of receipt with supporting images.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
            6. Limitation of Liability
          </h2>
          <p>
            Perfume Store shall not be liable for indirect, incidental, or consequential damages resulting from product use, shipping delays, or website downtime.
          </p>
        </section>

        <section className="space-y-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
            7. Contact Information
          </h2>
          <p>
            If you have questions regarding these Terms & Conditions, please contact our support team at{' '}
            <Link href="/support" className="font-semibold text-[#b42e31] hover:underline">
              Distributor Support
            </Link>{' '}
            or call us at (+1) 770 674 5948.
          </p>
        </section>
      </div>

      {/* Back Link */}
      <div className="mt-12 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white"
        >
          ← Return to Store
        </Link>
      </div>
    </div>
  );
}
