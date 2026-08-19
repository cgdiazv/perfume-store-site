'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { createUrl } from 'lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-xl">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="search"
        placeholder="Search for perfumes, brands, notes..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-4 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-[#b42e31] focus:outline-none dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-white dark:placeholder:text-neutral-400 dark:focus:border-[#b42e31]"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-0 top-0 mr-3 flex h-full items-center text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
