'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // Determine theme from document class or localStorage or system
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-full text-current transition-colors hover:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-800"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-amber-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      )}
    </button>
  );
}
