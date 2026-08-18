import { isCustomerLoggedIn } from 'lib/auth';
import { getProducts } from 'lib/bigcommerce';
import type { VercelProduct } from 'lib/bigcommerce/types';
import BestSellersSlider from './best-sellers-slider';

const requestedQueries = [
  'Calra',
  'Calra',
  'Valentino',
  'Versace',
  'Coach',
  'Jimmy Choo',
  'Dior',
  'Gucci',
  'Prada',
  'Burberry',
  'Armaf',
  'Montblanc'
];

export async function BestSellers() {
  const productResults = await Promise.all(
    requestedQueries.map(async (query) => {
      const { products: results } = await getProducts({ query });
      const normalizedQuery = query.toLowerCase();

      return (
        results.find((product) => {
          const title = product.title.toLowerCase();
          const handle = product.handle.toLowerCase();
          return title.includes(normalizedQuery) || handle.includes(normalizedQuery);
        }) ?? results[0]
      );
    })
  );

  const products = productResults.filter((product): product is VercelProduct => Boolean(product));
  const showPrices = isCustomerLoggedIn();

  if (!products?.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
      <BestSellersSlider products={products} showPrices={showPrices} />
    </section>
  );
}
