'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const SLIDES = [
  {
    id: 1,
    title: 'Wholesale Fragrance Lines',
    highlight: 'Distribution Ready',
    subtitle:
      'Curated fragrance brands and replenishment-friendly assortments for distributors, retailers, and buying groups.',
    ctaText: 'Browse Wholesale Lines',
    ctaLink: '/search',
    bgImage: '/images/landing/background/hero-image-1.webp'
  },
  {
    id: 2,
    title: 'Bulk Supply',
    highlight: 'Volume Distribution',
    subtitle:
      'Access dependable inventory, recurring replenishment, and wholesale-ready product selections for growing businesses.',
    ctaText: 'Explore Distribution Catalog',
    ctaLink: '/search',
    bgImage: '/images/landing/background/hero-image-2.webp'
  },
  {
    id: 3,
    title: 'Flexible Ordering',
    highlight: 'Reliable Fulfillment',
    subtitle:
      'Support your business with dependable sourcing, brand variety, and wholesale ordering for everyday distribution needs.',
    ctaText: 'Request Wholesale Access',
    ctaLink: '/support',
    bgImage: '/images/landing/background/hero-image-3.webp'
  }
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative flex h-[78vh] min-h-[560px] w-full items-center overflow-hidden bg-[#f8f7f4] dark:bg-[#12100e]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides Stack */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'
          }`}
        >
          {/* Background image with gentle zoom for subtle motion. */}
          <div
            className="saturate-75 absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat brightness-[1.03] dark:brightness-[0.6] transition-transform duration-[7000ms] ease-out"
            style={{
              backgroundImage: `url('${slide.bgImage}')`
            }}
          />
          <div className="from-white/90 via-white/75 to-white/30 dark:from-[#12100e]/90 dark:via-[#12100e]/80 dark:to-[#12100e]/40 absolute inset-0 bg-gradient-to-r" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f7f4]/60 dark:from-[#12100e]/80 to-transparent" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 md:px-6 min-[1320px]:px-0">
        <div className="w-full max-w-3xl">
          {SLIDES.map((slide, index) => {
            if (index !== currentIndex) return null;

            return (
              <div
                key={slide.id}
                className="bg-white/85 dark:bg-[#1c1815]/90 flex animate-fadeIn flex-col items-start gap-5 rounded-[32px] border border-[#e7e4dd] dark:border-neutral-800 p-7 text-[#2e2a26] dark:text-neutral-100 shadow-[0_20px_55px_rgba(80,64,36,0.10)] dark:shadow-[0_20px_55px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-8 md:p-10 md:pr-14"
              >
                <h1 className="font-sans text-4xl font-semibold uppercase leading-[1.04] tracking-tight text-[#2e2a26] dark:text-white sm:text-5xl md:text-6xl">
                  <span>{slide.title}</span>{' '}
                  <span className="mt-1 block text-[#b42e31]">{slide.highlight}</span>
                </h1>

                <p className="max-w-xl text-sm leading-relaxed text-[#4b433a] dark:text-neutral-300 sm:text-base md:text-lg">
                  {slide.subtitle}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center justify-center rounded-full bg-[#2f2923] dark:bg-[#b42e31] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-[#171412] dark:hover:bg-[#8f2226]"
                  >
                    {slide.ctaText}
                  </Link>
                  <Link
                    href="/search"
                    className="bg-white/70 dark:bg-neutral-800/70 inline-flex items-center justify-center rounded-full border border-[#d6cfc6] dark:border-neutral-700 px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#2f2923] dark:text-white transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800"
                  >
                    Explore Wholesale Catalog
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="bg-white/85 dark:bg-[#1c1815]/90 absolute left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#ddd5ca] dark:border-neutral-800 text-[#2f2923] dark:text-white shadow-md backdrop-blur-sm transition-all hover:border-[#b42e31] hover:text-[#b42e31] dark:hover:border-[#b42e31] dark:hover:text-[#b42e31] md:left-8"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="bg-white/85 dark:bg-[#1c1815]/90 absolute right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#ddd5ca] dark:border-neutral-800 text-[#2f2923] dark:text-white shadow-md backdrop-blur-sm transition-all hover:border-[#b42e31] hover:text-[#b42e31] dark:hover:border-[#b42e31] dark:hover:text-[#b42e31] md:right-8"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      <div className="bg-white/80 dark:bg-[#1c1815]/80 absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#ddd5ca] dark:border-neutral-800 px-5 py-2.5 shadow-md backdrop-blur-sm">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-[#b42e31]' : 'w-2.5 bg-[#b9aea0] dark:bg-neutral-600 hover:bg-[#9f9384] dark:hover:bg-neutral-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
