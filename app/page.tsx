import { BestSellers } from 'components/best-sellers'; // Import BestSellers component
import { FAQs } from 'components/faqs';
import { HeroBanner } from 'components/hero-banner'; // 1. Import your new Hero Component
import { SignatureBenefits } from 'components/signature-benefits';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description:
    'Discover wholesale fragrance distribution solutions with curated brand lines, dependable sourcing, and support for distributors and retailers.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  const faqImageSrc = '/images/products/desert-rose.webp';
  const faqImageAlt = 'Desert Rose perfume bottle';

  return (
    <>
      <HeroBanner /> {/* 2. Placed seamlessly at the opening tier */}
      <Suspense>
        <BestSellers />
      </Suspense>
      <SignatureBenefits />
      <FAQs imageSrc={faqImageSrc} imageAlt={faqImageAlt} />
    </>
  );
}
