import Image from 'next/image';

export function SignatureBenefits() {
  const benefits = [
    'Long-lasting aroma (8-12 hours)',
    'High-grade Arabic fragrance oils',
    'Rich imported essences',
    'Deep bold projection',
    'Premium handcrafted packaging'
  ];

  return (
    <section className="bg-[#faf4f1] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Our Signature Benefits
            </h2>
            <ul className="space-y-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#e2a693]">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <span className="ml-4 text-lg font-medium text-black">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center">
            <div className="relative h-[300px] w-full max-w-md overflow-hidden rounded-3xl border border-[#e2a693]/30 shadow-2xl sm:h-[400px] lg:h-[500px]">
              <Image
                src="/images/signature_benefits.png"
                alt="Signature Benefits Craftsmanship"
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
