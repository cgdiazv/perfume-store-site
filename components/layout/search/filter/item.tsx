'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { SortFilterItem } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { ListItem, PathFilterItem } from '.';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const hasActiveChild = Boolean(item.children?.some((child) => child.path === pathname));
  const [isOpen, setIsOpen] = useState(hasActiveChild);

  const newParams = new URLSearchParams(searchParams.toString());
  newParams.delete('q');

  const DynamicTag = active ? 'p' : Link;
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className="mt-2 flex flex-col text-black dark:text-white" key={item.title}>
      <div className="flex items-center justify-between gap-2">
        <DynamicTag
          href={createUrl(item.path, newParams)}
          onClick={() => {
            if (hasChildren) {
              setIsOpen((prev) => !prev);
            }
          }}
          className={clsx(
            'w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100 cursor-pointer',
            {
              'font-semibold underline underline-offset-4': active
            }
          )}
        >
          {item.title}
        </DynamicTag>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 text-neutral-400 hover:text-black dark:hover:text-white"
            aria-label={`Toggle ${item.title} subcategories`}
          >
            {isOpen ? (
              <ChevronDownIcon className="h-3.5 w-3.5" />
            ) : (
              <ChevronRightIcon className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className="ml-3 mt-1 flex flex-col gap-1 border-l border-neutral-200 pl-2.5 dark:border-neutral-800">
          {item.children!.map((child) => (
            <PathFilterItem key={child.title} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('sort') === item.slug;
  const q = searchParams.get('q');
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug })
    })
  );
  const DynamicTag = active ? 'p' : Link;

  return (
    <li className="mt-2 flex text-sm text-black dark:text-white" key={item.title}>
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={clsx('w-full hover:underline hover:underline-offset-4', {
          'underline underline-offset-4': active
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
