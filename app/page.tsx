import { HeroBanner } from 'components/hero-banner'; // 1. Import your new Hero Component
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
      <Suspense></Suspense>
    </>
  );
}
