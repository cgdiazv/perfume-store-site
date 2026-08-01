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
      className={`fixed left-0 right-0 top-0 z-50 border-b border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-300 dark:bg-white ${
        isScrolled ? 'py-2.5 shadow-sm' : 'py-3.5'
      }`}
    >
      {children}
    </header>
  );
}
