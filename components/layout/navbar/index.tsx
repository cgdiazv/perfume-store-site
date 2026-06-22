import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import { getMenu } from 'lib/bigcommerce';
import { VercelMenu as Menu } from 'lib/bigcommerce/types';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import NavbarScrollWrapper from './scroll-wrapper';
import Search from './search';

const { SITE_NAME } = process.env;

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <NavbarScrollWrapper>
      <nav className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="block flex-none md:hidden">
          <Suspense>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        <div className="flex w-full items-center">
          {/* Left Side: Logo, Title, and Dynamic Links */}
          <div className="flex w-full items-center md:w-1/3">
            <Link
              href="/"
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <Image
                src="/images/logo.png"
                alt="Store Logo"
                width={40}
                height={40}
                className="h-[40px] w-[40px] rounded-xl object-contain"
              />
              {/* Changed text-black to text-current to allow dynamic color shifting */}
              <div className="ml-2 flex-none text-sm font-semibold uppercase tracking-wider text-current md:hidden lg:block">
                {SITE_NAME}
              </div>
            </Link>

            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                {menu.map((item: Menu) => (
                  <li key={item.title}>
                    {/* Changed color classes to transition dynamically */}
                    <Link
                      href={item.path}
                      className="font-medium text-current no-underline transition-all duration-300 hover:opacity-50"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Center Side: Search Bar Input Box */}
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense>
              <Search />
            </Suspense>
          </div>

          {/* Right Side: Account Links and Shopping Cart Drawer Toggle */}
          <div className="flex items-center justify-end gap-4 md:w-1/3">
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/login"
                className="text-sm font-medium text-current transition hover:opacity-70"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#a8845e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8d6d4c]"
              >
                Create account
              </Link>
            </div>
            <Suspense fallback={<OpenCart />}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </nav>
    </NavbarScrollWrapper>
  );
}
