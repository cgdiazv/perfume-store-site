'use client';

import { PageInfo } from 'lib/bigcommerce/types';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ pageInfo }: { pageInfo?: PageInfo }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pageInfo || !pageInfo.hasNextPage || !pageInfo.endCursor) {
    return null;
  }

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  nextSearchParams.set('cursor', pageInfo.endCursor);

  return (
    <div className="flex justify-center py-8">
      <Link
        href={`${pathname}?${nextSearchParams.toString()}`}
        className="border-black/10 dark:border-white/10 rounded-full border bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100 dark:bg-black dark:text-white dark:hover:bg-neutral-900"
      >
        Next Page
      </Link>
    </div>
  );
}
