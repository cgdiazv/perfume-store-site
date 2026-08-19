'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || 'Unable to sign in.');
        return;
      }

      window.location.href = '/';
    } catch (err) {
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Wholesale sign in
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-neutral-300">
          Access your distributor account to manage orders, review inventory, and track wholesale
          shipments.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#181412]"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200">
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#b42e31] hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-900 dark:bg-red-950/60 dark:text-red-300 dark:border dark:border-red-900">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-full bg-[#b42e31] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8f2226] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-neutral-400">
        New to our wholesale program?{' '}
        <Link href="/register" className="font-semibold text-[#b42e31] hover:opacity-80">
          Create an account
        </Link>
      </p>
    </div>
  );
}
