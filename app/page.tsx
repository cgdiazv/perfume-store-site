import { BestSellers } from 'components/best-sellers'; // Import BestSellers component
import { HeroBanner } from 'components/hero-banner'; // 1. Import your new Hero Component
import { FAQs } from 'components/faqs';
import { SignatureBenefits } from 'components/signature-benefits';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and BigCommerce.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      <HeroBanner /> {/* 2. Placed seamlessly at the opening tier */}
      <Suspense>
        <BestSellers />
      </Suspense>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <hr className="border-t-2 border-[#8B4513] opacity-50" />
      </div>
      <SignatureBenefits />
      <FAQs />
    </>
  );
}
