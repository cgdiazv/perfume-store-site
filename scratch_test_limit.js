const { bigCommerceFetch } = require('./lib/bigcommerce');

const testQuery = `
  query searchProducts($filters: SearchProductsFiltersInput!, $sort: SearchProductsSortInput) {
    site {
      search {
        searchProducts(filters: $filters, sort: $sort) {
          products(first: 50) {
            edges {
              node {
                entityId
                name
              }
            }
          }
        }
      }
    }
  }
`;

async function testLimit() {
  const res = await bigCommerceFetch({
    query: testQuery,
    variables: {
      filters: {
        searchTerm: '',
        categoryEntityIds: [37, 38, 39, 40, 41, 42, 43]
      }
    }
  });

  const products = res.body.data.site.search.searchProducts.products.edges.map((e) => e.node);
  console.log(`Returned ${products.length} products with (first: 50):`);
  products.forEach((p) => console.log(`  - ${p.name} (id: ${p.entityId})`));
}

testLimit();
