'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Contact Support
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We&apos;re here to help. Fill out the form below and we&apos;ll get back to you as soon as
          possible.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl bg-[#f4ecde] p-8 text-center sm:p-10">
          <h3 className="text-xl font-semibold text-gray-900">Thank you for contacting us!</h3>
          <p className="mt-4 text-gray-600">
            Your message has been received. Our support team will reach out to you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#a8845e] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8d6d4c]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#a8845e] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#a8845e] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
              Subject
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="subject"
                id="subject"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#a8845e] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
              Message
            </label>
            <div className="mt-2">
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#a8845e] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">
                There was an error sending your message. Please try again.
              </p>
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-full bg-[#a8845e] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8d6d4c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8845e] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
