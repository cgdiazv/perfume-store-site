'use client';

import { useState } from 'react';
import Link from 'next/link';

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I find my signature scent?',
      answer:
        'We recommend starting with our fragrance quiz or visiting our Atlanta store for a personalized consultation. Our experts will guide you through different scent families to find your perfect match.'
    },
    {
      question: 'Can I return a perfume if I dont like it?',
      answer:
        "Yes! We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, return the unused portion for a full refund or exchange."
    },
    {
      question: 'Do you offer gift wrapping services?',
      answer:
        'Absolutely! We provide complimentary luxury gift wrapping with a personalized message card. Premium gift boxes are also available for an additional fee.'
    },
    {
      question: 'How long do perfumes typically last?',
      answer:
        'Our Eau de Parfum formulations typically last 6-8 hours, while our Parfum concentrations can last 8-12 hours. Oud-based fragrances often have even longer lasting power.'
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Column: Title & Subtitle */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">FAQs</h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about fragrances, shipping, and customer support.
          </p>
        </div>

        {/* Right Column: Questions & Answers */}
        <div>
          <dl className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-[#f4ecde] p-6 shadow-sm"
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
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
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
          <div className="mt-12 rounded-2xl bg-[#f4ecde] p-8 sm:p-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Still have questions?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Contact our support team and we will make sure everything is clear and intuitive for
                you!
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-full bg-[#a8845e] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8d6d4c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8845e]"
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
