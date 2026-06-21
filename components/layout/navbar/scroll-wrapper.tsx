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
    <div
      data-scrolled={isScrolled}
      className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-[#ffffff] text-black shadow-sm transition-all duration-500 ease-in-out"
    >
      <div className={`transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
        {children}
      </div>
    </div>
  );
}
