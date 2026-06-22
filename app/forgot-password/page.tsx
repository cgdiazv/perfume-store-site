'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body?.error || 'Unable to request password reset.');
        return;
      }

      setSuccess('If that email exists, we sent a password reset link.');
      setEmail('');
    } catch (err) {
      setError('Unable to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Reset your password
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Enter your email and we will send a password reset link.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#a8845e] sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-900">{error}</div>}

        {success && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">{success}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-full bg-[#a8845e] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8d6d4c] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
}
