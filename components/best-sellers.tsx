import { getCollectionProducts } from 'lib/bigcommerce';
import BestSellersSlider from './best-sellers-slider';

export async function BestSellers() {
  const products = await getCollectionProducts({ collection: 'hidden-homepage-featured-items' });

  if (!products?.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
      <BestSellersSlider products={products} />
    </section>
  );
}
