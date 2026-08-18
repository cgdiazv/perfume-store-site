import { UserIcon } from '@heroicons/react/24/outline';
import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Logo from 'components/logo';
import { isCustomerLoggedIn } from 'lib/auth';
import { getMenu } from 'lib/bigcommerce';
import { VercelMenu as Menu } from 'lib/bigcommerce/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import NavbarScrollWrapper from './scroll-wrapper';

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  const isLoggedIn = isCustomerLoggedIn();

  return (
    <NavbarScrollWrapper>
      <nav className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 lg:px-8">
        <div className="flex w-full items-center justify-between">
          {/* Left Side: Logo, Title, and Dynamic Links */}
          <div className="flex items-center gap-6">
            <Logo className="mr-2 lg:mr-4" />

            {menu.length ? (
              <ul className="hidden flex-wrap gap-4 text-sm md:flex md:items-center lg:gap-6">
                {menu.map((item: Menu) => (
                  <li key={item.title} className="group/nav-item relative pb-4">
                    <Link
                      href={item.path}
                      className="whitespace-nowrap font-medium text-current no-underline transition-all duration-300 hover:opacity-50"
                    >
                      {item.title}
                    </Link>
                    {item.children?.length ? (
                      <ul className="absolute left-0 top-full z-50 mt-0 hidden min-w-[180px] flex-col rounded-lg border border-neutral-200 bg-white p-2 pt-4 shadow-lg group-focus-within/nav-item:flex group-hover/nav-item:flex dark:border-neutral-800 dark:bg-black">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <Link
                              href={child.path}
                              className="block rounded-md px-3 py-2 text-sm text-current transition hover:bg-neutral-100 dark:hover:bg-neutral-900"
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
            ) : null}
          </div>

          {/* Right Side: Account Links and Shopping Cart Drawer Toggle */}
          <div className="flex flex-none items-center justify-end gap-4">
            <div className="hidden items-center gap-4 md:flex">
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="text-sm font-medium text-current transition hover:opacity-70"
                >
                  My account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-current transition hover:opacity-70"
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
      </nav>
    </NavbarScrollWrapper>
  );
}
