'use client';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

import { Bars3Icon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { VercelMenu as Menu } from 'lib/bigcommerce/types';
import Search from './search';

export default function MobileMenu({ menu, isLoggedIn }: { menu: Menu[]; isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md text-current transition-colors focus:outline-none focus:ring-0 md:hidden dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="bg-black/30 fixed inset-0" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col overflow-y-auto bg-white pb-6 dark:bg-[#181412]">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>

                <div className="mb-4 w-full">
                  <Search />
                </div>
                {menu.length ? (
                  <ul className="flex w-full flex-col">
                    {menu.map((item: Menu) => {
                      const hasChildren = Boolean(item.children?.length);
                      const isExpanded = Boolean(expandedItems[item.title]);

                      return (
                        <li className="py-2" key={item.title}>
                          <div className="flex items-center justify-between">
                            <Link
                              href={item.path}
                              onClick={() => {
                                if (hasChildren) {
                                  toggleExpand(item.title);
                                }
                                closeMobileMenu();
                              }}
                              className="text-lg font-semibold text-black transition-colors hover:text-[#b42e31] dark:text-white dark:hover:text-[#b42e31]"
                            >
                              {item.title}
                            </Link>

                            {hasChildren && (
                              <button
                                type="button"
                                onClick={() => toggleExpand(item.title)}
                                className="p-1 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                                aria-label={`Toggle ${item.title} subcategories`}
                              >
                                {isExpanded ? (
                                  <ChevronUpIcon className="h-5 w-5" />
                                ) : (
                                  <ChevronDownIcon className="h-5 w-5" />
                                )}
                              </button>
                            )}
                          </div>

                          {hasChildren && isExpanded && (
                            <ul className="mt-2.5 flex flex-col gap-2 pl-3 border-l-2 border-[#b42e31]/40 dark:border-[#b42e31]/60">
                              {item.children?.map((child: Menu) => (
                                <li key={child.title}>
                                  <Link
                                    href={child.path}
                                    onClick={closeMobileMenu}
                                    className="block py-1 text-base text-neutral-600 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white"
                                  >
                                    {child.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}

                <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                  {isLoggedIn ? (
                    <Link
                      href="/account"
                      onClick={closeMobileMenu}
                      className="text-lg font-medium text-black transition hover:opacity-70 dark:text-white"
                    >
                      My account
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="text-lg font-medium text-black transition hover:opacity-70 dark:text-white"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        onClick={closeMobileMenu}
                        className="w-full rounded-full bg-[#b42e31] px-4 py-3 text-center text-lg font-semibold text-white transition hover:bg-[#8f2226]"
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
