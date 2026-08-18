# Next.js Commerce <br/> <sup><i>for BigCommerce</i></sup>

This is our fork of Vercel's Next.js storefront starter.

> [!NOTE] > **✨ Looking for more out-of-the-box ecommerce functionality? Try Catalyst, BigCommerce's reference storefront for Next.js. ✨**
>
> Catalyst is our first-party developed and fully supported Next.js storefront, offering:
>
> - Deep integration with our 100s of commerce features, all powered by GraphQL
> - Fully customizable UI kit built specifically for ecommerce
> - Easily configurable multi-region and multi-lingual storefront support
>
> [Learn more at catalyst.dev →](https://catalyst.dev)

## Prerequisites

This starter requires a [BigCommerce sandbox](https://start.bigcommerce.com/developer-sandbox/) or a [production store provisioned to run a headless storefront](https://www.bigcommerce.com/solutions/multi-store/).

To get started, use this README and the [example environment variable comments](https://github.com/bigcommerce/nextjs-commerce/blob/main/.env.example).

## Develop locally

Clone the template repo manually and supply the environment variables [defined in .env.example](https://github.com/bigcommerce/nextjs-commerce/blob/main/.env.example). The best practice is to use [Vercel environment variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: Do not commit your `.env` file. It exposes secrets that allow others to control your BigCommerce store.

- Install the Vercel CLI:

```bash
npm i -g vercel
```

- Link your local instance with the desired Vercel and GitHub accounts. This action creates a `.vercel` directory:

```bash
vercel link
```

- Download the [Vercel environment variables](https://vercel.com/docs/concepts/projects/environment-variables):

```bash
vercel env pull
```

- Install the app's default dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The app runs on [localhost:3000](http://localhost:3000/).

## Configure checkout

- [Optimized One-Page Checkout](https://developer.bigcommerce.com/stencil-docs/customizing-checkout/optimized-one-page-checkout)
- [Stencil theme to customize checkout page](https://developer.bigcommerce.com/stencil-docs/getting-started/about-stencil#stencil-cli) and inform styling of shopper emails

## Get to know the BigCommerce GraphQL Storefront API

In addition to being compatible with BigCommerce's multi-storefront features, this starter uses the [GraphQL Storefront API](https://developer.bigcommerce.com/api-docs/storefront/graphql/graphql-api-overview). This API makes it possible for merchants to control the representation of products and categories, carts, orders, customer segmentation, and more. To get a sense of what is possible to do directly on the storefront, check out the [GraphQL Playground](https://developer.bigcommerce.com/graphql-storefront/playground).

When you access the Playground through the store control panel, BigCommerce provides a valid GraphQL Storefront authentication token without any additional API calls on your part. To access the dedicated GraphQL Playground for a particular sandbox or store, sign in to its BigCommerce account and navigate to **[Settings > API](https://login.bigcommerce.com/deep-links/manage/settings-list)**, then click **Storefront API Playground**.

## Explore BigCommerce features

Visit BigCommerce's developer center to learn more about all aspects of our platform. Here are some quick links to kick off your journey:

Core store configuration:

- [Catalog management](https://developer.bigcommerce.com/docs/rest-catalog)
- [Multi-Storefront and alternate channel sales](https://developer.bigcommerce.com/api-docs/multi-storefront/overview)
- [Buy Online, Pick up in Store](https://developer.bigcommerce.com/buy-online-pick-up-in-store/overview), also known as Click and Collect
- [Webhooks](https://developer.bigcommerce.com/docs/webhooks/overview)

Shopper journeys:

- [GraphQL Storefront Faceted Search](https://developer.bigcommerce.com/api-docs/storefront/graphql/graphql-faceted-textual-search)
- [Promotions](https://developer.bigcommerce.com/promotions/overview)
- [Customer Segmentation](https://developer.bigcommerce.com/customer-segmentation/overview)
- [GraphQL Storefront Carts and Checkouts](https://developer.bigcommerce.com/api-docs/storefront/graphql/carts-and-checkout)
- [Abandoned Carts](https://developer.bigcommerce.com/docs/rest-management/abandoned-carts)
- [Payments](https://developer.bigcommerce.com/docs/rest-payments)
- [Tax](https://developer.bigcommerce.com/docs/rest-management/tax-settings#get-tax-settings)
- [Orders](https://developer.bigcommerce.com/api-docs/storefronts/guide/orders)
- [Emails](https://developer.bigcommerce.com/docs/rest-content/email-templates)
- [Shipping](https://developer.bigcommerce.com/docs/rest-management/shipping-v2)

## Join our developer community

We'd love to see hear any feedback and answer your questions in our [Developer Community](https://developer.bigcommerce.com/community).
