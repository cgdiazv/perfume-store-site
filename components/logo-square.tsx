import clsx from 'clsx';
import Image from 'next/image';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center overflow-hidden border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[30px] w-[30px] rounded-lg': size === 'sm'
        }
      )}
    >
      <Image
        src="/logo.webp"
        alt="Logo"
        width={size === 'sm' ? 24 : 32}
        height={size === 'sm' ? 24 : 32}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
