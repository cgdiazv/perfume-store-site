import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { VercelProduct as Product } from 'lib/bigcommerce/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({
  product,
  showPrices
}: {
  product: Product;
  showPrices: boolean;
}) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-gold-600 p-2 text-sm text-white">
          {showPrices ? (
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          ) : (
            <a href="/login" className="font-medium hover:underline">
              Sign in to view price
            </a>
          )}
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml ? (
        <Prose
          className="dark:text-white/[60%] mb-6 text-sm leading-tight"
          html={product.descriptionHtml}
        />
      ) : null}

      <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
    </>
  );
}
