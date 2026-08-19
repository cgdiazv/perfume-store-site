import Footer from 'components/layout/footer'; // 1. Imported the Footer
import Navbar from 'components/layout/navbar';
import { ensureStartsWith } from 'lib/utils';
import { Cinzel, Montserrat } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import './globals.css';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-cinzel'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-montserrat'
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="selection:bg-gold-500/30 group flex min-h-screen flex-col bg-white text-black antialiased dark:bg-[#12100e] dark:text-neutral-100">
        <Navbar />

        {/* Main content clears space for the fixed navbar with 0 extra gap */}
        <Suspense>
          <main className="flex-grow pt-[65px] md:pt-[68px]">{children}</main>
        </Suspense>

        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
