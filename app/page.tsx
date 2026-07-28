import { BestSellers } from 'components/best-sellers'; // Import BestSellers component
import { FAQs } from 'components/faqs';
import { HeroBanner } from 'components/hero-banner'; // 1. Import your new Hero Component
import { SignatureBenefits } from 'components/signature-benefits';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description:
    'Discover luxury artisan perfumes, long-lasting body oils, and exclusive gift sets at Perfume Store Atlanta.',
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
