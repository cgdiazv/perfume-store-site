'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function FAQs({ imageSrc, imageAlt }: { imageSrc?: string; imageAlt?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I source fragrance brands for wholesale distribution?',
      answer:
        'We help distributors and resellers access curated fragrance brands with dependable supply, clear product information, and account support for bulk ordering.'
    },
    {
      question: 'Can I place recurring or volume orders?',
      answer:
        'Yes. Our wholesale model is built for repeat purchasing, replenishment planning, and larger distribution needs across retail and reseller channels.'
    },
    {
      question: 'Do you support distributor account onboarding?',
      answer:
        'Absolutely. We provide wholesale account access, product guidance, and support to help new and growing distributors get started quickly.'
    },
    {
      question: 'How do you support business buyers?',
      answer:
        'We focus on reliable product selection, consistent availability, and responsive support so your distribution operation runs smoothly.'
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: Title, Subtitle, and Featured Image */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">FAQs</h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about wholesale sourcing, ordering, and distributor support.
          </p>

          {/* Featured Image under FAQ subtext */}
          <div className="relative mt-8 h-[300px] w-full max-w-md overflow-hidden rounded-3xl border border-[#b42e31]/30 shadow-xl sm:h-[400px] lg:h-[500px]">
            <Image
              src={imageSrc || '/images/faq_man_perfume.png'}
              alt={imageAlt || 'Man holding luxury perfume bottle'}
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Column: Questions & Answers */}
        <div className="flex flex-col justify-between">
          <dl className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-[#faf4f1] p-6 shadow-sm transition-all hover:border-[#b42e31]/40"
                >
                  <dt>
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-start justify-between text-left text-gray-900"
                    >
                      <span className="text-lg font-semibold leading-7">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        {isOpen ? (
                          <svg
                            className="h-6 w-6 text-[#b42e31]"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </dt>
                  {isOpen && (
                    <dd className="mt-4 pr-12 text-base leading-7 text-gray-600">{faq.answer}</dd>
                  )}
                </div>
              );
            })}
          </dl>

          {/* Support Box */}
          <div className="mt-8 rounded-2xl border border-neutral-100 bg-[#faf4f1] p-8 sm:p-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Still have questions?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Contact our wholesale support team and we will help you with sourcing, orders, and
                account questions.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-full bg-[#b42e31] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#8f2226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b42e31]"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
