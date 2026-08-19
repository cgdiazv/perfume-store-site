'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [businessTaxId, setBusinessTaxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
          company,
          businessTaxId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || 'Unable to register account.');
        return;
      }

      setSuccess('Your account was created successfully. You can now sign in.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhone('');
      setCompany('');
      setBusinessTaxId('');
    } catch (err) {
      setError('Unable to register account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Create a wholesale account
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-neutral-300">
          Register for distributor access and unlock wholesale catalog viewing, account support, and
          ordering tools.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#181412]"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200"
            >
              First name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200">
              Last name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

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
          <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200">
            Company name
          </label>
          <div className="mt-2">
            <input
              id="company"
              name="company"
              type="text"
              required
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="businessTaxId"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200"
          >
            EIN
          </label>
          <div className="mt-2">
            <input
              id="businessTaxId"
              name="businessTaxId"
              type="text"
              required
              value={businessTaxId}
              onChange={(event) => setBusinessTaxId(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200">
            Phone
          </label>
          <div className="mt-2">
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200"
            >
              Confirm password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b42e31] dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-900 dark:bg-red-950/60 dark:text-red-300 dark:border dark:border-red-900">{error}</div>}

        {success && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-900">{success}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-full bg-[#b42e31] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8f2226] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#b42e31] hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  );
}
