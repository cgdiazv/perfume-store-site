import { UserIcon } from '@heroicons/react/24/outline';
import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Logo from 'components/logo';
import { isCustomerLoggedIn } from 'lib/auth';
import { getMenu } from 'lib/bigcommerce';
import { VercelMenu as Menu } from 'lib/bigcommerce/types';
import Link from 'next/link';
import { Suspense } from 'react';
import ThemeToggle from 'components/theme-toggle';
import MobileMenu from './mobile-menu';
import NavbarScrollWrapper from './scroll-wrapper';
import Search from './search';

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  const isLoggedIn = isCustomerLoggedIn();

  return (
    <NavbarScrollWrapper>
      <nav className="relative mx-auto flex w-full max-w-7xl flex-col gap-2.5 px-4 lg:px-6 min-[1320px]:px-0">
        {/* Top Row: Logo (Left), Centered & Longer Search Bar (Center), Controls (Right) */}
        <div className="flex w-full items-center justify-between gap-4 md:gap-8">
          {/* Left Side: Logo */}
          <div className="flex flex-none items-center">
            <Logo className="flex-none" />
          </div>

          {/* Center: Centered & Longer Search Bar */}
          <div className="flex flex-1 items-center justify-center max-w-2xl mx-auto">
            <Suspense fallback={<div className="h-10 w-full max-w-md rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />}>
              <Search />
            </Suspense>
          </div>

          {/* Right Side: Account Links and Shopping Cart Drawer Toggle */}
          <div className="flex flex-none items-center justify-end gap-3 md:gap-4">
            <ThemeToggle />
            <div className="hidden items-center gap-4 md:flex">
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="text-sm font-medium text-black transition hover:opacity-70 dark:text-white"
                >
                  My account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-black transition hover:opacity-70 dark:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-[#b42e31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8f2226]"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
            <Suspense fallback={<OpenCart />}>
              <Cart />
            </Suspense>
            <div className="flex items-center md:hidden">
              <Link
                href={isLoggedIn ? '/account' : '/login'}
                aria-label="Account"
                className="flex h-11 w-11 items-center justify-center rounded-md text-current transition-colors focus:outline-none focus:ring-0 dark:text-white"
              >
                <UserIcon className="h-4" />
              </Link>
              <Suspense>
                <MobileMenu menu={menu} isLoggedIn={isLoggedIn} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Bottom Row: Left-Aligned Navigation Menu */}
        {menu.length ? (
          <div className="hidden w-full items-center justify-start border-t border-neutral-100 pt-2 md:flex dark:border-neutral-800/60">
            <ul className="flex flex-wrap items-center justify-start gap-6 text-sm lg:gap-8">
              {menu.map((item: Menu) => (
                <li key={item.title} className="group/nav-item relative pb-1">
                  <Link
                    href={item.path}
                    className="whitespace-nowrap font-medium text-black transition-all duration-300 hover:opacity-50 dark:text-white"
                  >
                    {item.title}
                  </Link>
                  {item.children?.length ? (
                    <ul className="absolute left-0 top-full z-50 mt-0 hidden min-w-[180px] flex-col rounded-lg border border-neutral-200 bg-white p-2 shadow-lg group-focus-within/nav-item:flex group-hover/nav-item:flex dark:border-neutral-800 dark:bg-[#181412]">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <Link
                            href={child.path}
                            className="block rounded-md px-3 py-2 text-sm text-black transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </NavbarScrollWrapper>
  );
}
