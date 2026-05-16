'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function NavbarScrollWrapper({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <div
      data-scrolled={isScrolled}
      data-homepage={isHomePage} // <-- ADD THIS ATTRIBUTE HERE
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-in-out ${
        isHomePage && !isScrolled
          ? '!border-transparent !bg-transparent text-white'
          : 'border-b border-neutral-200/50 bg-white text-black shadow-sm backdrop-blur-md'
      }`}
    >
      <div className={`transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
        {children}
      </div>
    </div>
  );
}
