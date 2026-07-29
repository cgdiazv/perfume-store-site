import { GridTileImage } from 'components/grid/tile';
import { isCustomerLoggedIn } from 'lib/auth';
import { getCollectionProducts } from 'lib/bigcommerce';
import type { VercelProduct as Product } from 'lib/bigcommerce/types';
import Link from 'next/link';

function ThreeItemGridItem({
  item,
  size,
  priority,
  showPrices
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
  showPrices: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={`${item.handle}`}>
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title as string,
            amount: showPrices ? item.priceRange.maxVariantPrice.amount : '',
            currencyCode: showPrices ? item.priceRange.maxVariantPrice.currencyCode : '',
            showPrice: showPrices
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionProducts({
    collection: 'hidden-homepage-featured-items'
  });
  const showPrices = isCustomerLoggedIn();

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} showPrices={showPrices} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} showPrices={showPrices} />
      <ThreeItemGridItem size="half" item={thirdProduct} showPrices={showPrices} />
    </section>
  );
}
