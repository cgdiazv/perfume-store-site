import Link from 'next/link';

export function HeroBanner() {
  return (
    /* Increased height parameters to h-[85vh] and min-h-[620px] */
    <div className="relative flex h-[85vh] min-h-[620px] w-full items-center overflow-hidden bg-white">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 scale-100 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/landing/background/header.webp')"
        }}
      />

      {/* Subdued overlay for readable typography */}
      <div className="from-white/30 via-white/10 absolute inset-0 bg-gradient-to-r to-transparent" />

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-4 min-[1320px]:px-0">
        <div className="flex max-w-2xl animate-fadeIn flex-col items-start gap-4">
          {/* Main Copy with Split Contrast Styling */}
          <h1 className="font-sans text-5xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl">
            <span className="text-neutral-100 drop-shadow-sm">Crafted</span>{' '}
            <span className="mt-1 block text-blue-600">for Timeless Beauty</span>
          </h1>

          {/* Subtext from your asset */}
          <p className="text-black/85 mt-2 max-w-md text-sm font-medium leading-relaxed tracking-wide md:text-base">
            A collection of artisan perfumes and oils inspired by tradition, crafted with modern
            elegance.
          </p>

          {/* Call to Action */}
          <div className="mt-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-[1px] hover:bg-blue-500 hover:shadow-md active:translate-y-0"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
