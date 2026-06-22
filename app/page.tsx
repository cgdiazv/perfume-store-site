import { BestSellers } from 'components/best-sellers'; // Import BestSellers component
import { FAQs } from 'components/faqs';
import { HeroBanner } from 'components/hero-banner'; // 1. Import your new Hero Component
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
      <SignatureBenefits />
      <FAQs />
    </>
  );
}
