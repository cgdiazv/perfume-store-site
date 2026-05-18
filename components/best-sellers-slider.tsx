'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { VercelProduct } from 'lib/bigcommerce/types';
import Link from 'next/link';
import { useRef } from 'react';
import { GridTileImage } from './grid/tile';

export default function BestSellersSlider({ products }: { products: VercelProduct[] }) {
  const sliderRef = useRef<HTMLUListElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-sans text-2xl font-bold uppercase tracking-wide text-black">
          Best Sellers
        </h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-black transition-colors hover:border-blue-600 hover:text-blue-600"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-black transition-colors hover:border-blue-600 hover:text-blue-600"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ul
        ref={sliderRef}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-6 pt-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, i) => (
          <li
            key={`${product.handle}${i}`}
            className="relative aspect-square w-2/3 max-w-[300px] flex-none snap-start md:w-1/3 lg:w-1/4"
          >
            <Link href={`${product.handle}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
