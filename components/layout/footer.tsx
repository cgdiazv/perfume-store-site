import Link from 'next/link';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 border-t border-neutral-200 px-6 py-12 text-sm md:grid md:grid-cols-4 md:gap-8 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <h3 className="mb-4 font-semibold text-black dark:text-white">Atlanta</h3>
          <p className="mb-2">T: (+1) 404 555 1234</p>
          <p>123 Peachtree Street,</p>
          <p>Atlanta, GA 30303</p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-black dark:text-white">Buckhead</h3>
          <p className="mb-2">T: (+1) 404 555 5678</p>
          <p>3500 Peachtree Road,</p>
          <p>Atlanta, GA 30326</p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-black dark:text-white">Quick Links</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/search"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Latest News
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-black dark:text-white">Follow Us</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Pinterest
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <p className="md:ml-auto">
            <a
              href="https://indevasa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 no-underline dark:text-neutral-400"
            >
              Indeva Websites
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
