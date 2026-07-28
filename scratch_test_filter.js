const { bigCommerceFetch } = require('./lib/bigcommerce');
const { searchProductsQuery } = require('./lib/bigcommerce/queries/product');

async function testFilter() {
  const targetCategoryIds = [37, 38, 39, 40, 41, 42, 43];

  console.log('--- Testing searchProducts with categoryEntityIds ---');
  try {
    const res = await bigCommerceFetch({
      query: searchProductsQuery,
      variables: {
        filters: {
          searchTerm: '',
          categoryEntityIds: targetCategoryIds
        }
      }
    });

    const products = res.body.data.site.search.searchProducts.products.edges.map((e) => e.node);
    console.log(`Found ${products.length} products with category filter:`);
    products.forEach((p) => console.log(`  - ${p.name} (id: ${p.entityId})`));
  } catch (err) {
    console.error('Error with category filter:', err);
  }
}

testFilter();
