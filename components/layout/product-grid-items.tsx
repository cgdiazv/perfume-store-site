import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { isCustomerLoggedIn } from 'lib/auth';
import { VercelProduct as Product } from 'lib/bigcommerce/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  const showPrices = isCustomerLoggedIn();

  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`${product.handle}`}>
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: showPrices ? product.priceRange.maxVariantPrice.amount : '',
                currencyCode: showPrices ? product.priceRange.maxVariantPrice.currencyCode : '',
                showPrice: showPrices,
                availableForSale: product.availableForSale
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
