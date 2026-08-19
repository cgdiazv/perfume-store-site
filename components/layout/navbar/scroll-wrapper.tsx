'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function NavbarScrollWrapper({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

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
  }, []);

  return (
    <header
      data-scrolled={isScrolled}
      className={`fixed left-0 right-0 top-0 z-50 border-b border-neutral-200 bg-white/95 text-black backdrop-blur-md transition-all duration-300 dark:border-neutral-800 dark:bg-[#12100e]/95 dark:text-white ${
        isScrolled ? 'py-2.5 shadow-sm dark:shadow-neutral-900/50' : 'py-3.5'
      }`}
    >
      {children}
    </header>
  );
}
