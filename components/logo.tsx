import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex select-none flex-col items-center text-center ${className}`}
    >
      <span className="font-serif text-base font-bold uppercase tracking-[0.18em] text-[#b42e31] transition-opacity group-hover:opacity-90 md:text-lg">
        <span className="block leading-[0.88]">PERFUME</span>
        <span className="block leading-[0.88]">STORE</span>
      </span>
      <span className="-mt-0.5 pl-[0.32em] font-sans text-[8px] font-normal uppercase leading-none tracking-[0.32em] text-neutral-800 md:text-[9px] dark:text-neutral-200">
        Atlanta
      </span>
    </Link>
  );
}
