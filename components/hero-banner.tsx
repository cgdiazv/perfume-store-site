'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const SLIDES = [
  {
    id: 1,
    title: 'Crafted for',
    highlight: 'Timeless Elegance',
    subtitle:
      'Discover our signature collection of artisanal body oils and perfumes for Men and Women, crafted with rare essences.',
    ctaText: 'Shop Men & Women',
    ctaLink: '/search/men',
    bgImage: '/images/hero_slide_1.png'
  },
  {
    id: 2,
    title: 'Unforgettable',
    highlight: 'Luxury Gift Sets',
    subtitle:
      'Present the ultimate expression of sophistication with curated fragrance gift sets for Men and Women.',
    ctaText: 'Explore Gift Sets',
    ctaLink: '/search/gift-sets-for-men',
    bgImage: '/images/hero_slide_2.png'
  },
  {
    id: 3,
    title: 'Artisan Testers &',
    highlight: 'Fragrance Oils',
    subtitle:
      'Experience concentrated fragrance extractions, long-lasting perfume oils, and delicate blends for the whole family.',
    ctaText: 'Discover Testers',
    ctaLink: '/search/tester-for-men',
    bgImage: '/images/hero_slide_3.png'
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
      className="relative flex h-[85vh] min-h-[620px] w-full items-center overflow-hidden bg-[#1f1a19]"
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
          {/* Background Image Layer with slight darkening filter for enhanced contrast */}
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat brightness-[0.65] transition-transform duration-[7000ms] ease-out"
            style={{
              backgroundImage: `url('${slide.bgImage}')`
            }}
          />
          {/* Dark Contrast Vignette Overlays */}
          <div className="from-black/90 via-black/60 to-black/20 absolute inset-0 bg-gradient-to-r" />
          <div className="from-black/80 to-black/40 absolute inset-0 bg-gradient-to-t via-transparent" />
        </div>
      ))}

      {/* Hero Content Container with High-Contrast Glass Container */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 md:px-6 min-[1320px]:px-0">
        <div className="max-w-2xl">
          {SLIDES.map((slide, index) => {
            if (index !== currentIndex) return null;

            return (
              <div
                key={slide.id}
                className="border-white/15 bg-black/65 flex animate-fadeIn flex-col items-start gap-5 rounded-3xl border p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8 md:p-10"
              >
                {/* Badge Category Tag */}
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f2c7bb]/40 bg-[#e2a693]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#f8d7cd] shadow-sm backdrop-blur-md">
                  Featured Collection
                </span>

                {/* Main Heading */}
                <h1 className="font-sans text-4xl font-black uppercase leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] sm:text-5xl md:text-6xl">
                  <span>{slide.title}</span>{' '}
                  <span className="mt-1 block text-[#f5b8a7] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                    {slide.highlight}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-xl text-sm font-medium leading-relaxed text-neutral-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-base md:text-lg">
                  {slide.subtitle}
                </p>

                {/* Call to Action Buttons */}
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center justify-center rounded-full bg-[#e2a693] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.15em] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#c8816d] active:scale-100"
                  >
                    {slide.ctaText}
                  </Link>
                  <Link
                    href="/search"
                    className="border-white/40 bg-white/10 hover:bg-white/25 inline-flex items-center justify-center rounded-full border px-8 py-4 text-xs font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur-md transition-all duration-300 hover:border-white"
                  >
                    View All Categories
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="border-white/30 bg-black/50 absolute left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border text-white shadow-lg backdrop-blur-md transition-all hover:border-[#e2a693] hover:bg-[#e2a693] hover:text-white md:left-8"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="border-white/30 bg-black/50 absolute right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border text-white shadow-lg backdrop-blur-md transition-all hover:border-[#e2a693] hover:bg-[#e2a693] hover:text-white md:right-8"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Slide Indicators Dots */}
      <div className="border-white/20 bg-black/60 absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border px-5 py-2.5 shadow-xl backdrop-blur-md">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-[#e2a693]' : 'bg-white/50 w-2.5 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
