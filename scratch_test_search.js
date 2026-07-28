const {
  getProducts,
  getCollectionProducts,
  getCollection,
  getCollections
} = require('./lib/bigcommerce');

async function test() {
  console.log("--- Testing getProducts({ query: '' }) ---");
  try {
    const prods = await getProducts({ query: '' });
    console.log(`getProducts({ query: '' }) returned ${prods.length} products:`);
    prods.forEach((p) => console.log(`  - ${p.title} (id: ${p.id}, handle: ${p.handle})`));
  } catch (err) {
    console.error('Error in getProducts:', err);
  }

  console.log("\n--- Testing getCollectionProducts('men') ---");
  try {
    const menProds = await getCollectionProducts({ collection: 'men' });
    console.log(`getCollectionProducts('men') returned ${menProds.length} products:`);
    menProds.forEach((p) => console.log(`  - ${p.title} (id: ${p.id}, handle: ${p.handle})`));
  } catch (err) {
    console.error("Error in getCollectionProducts('men'):", err);
  }

  console.log('\n--- Testing getCollections() ---');
  try {
    const cols = await getCollections();
    console.log(`getCollections() returned ${cols.length} collections:`);
    cols.forEach((c) => console.log(`  - ${c.title} (handle: ${c.handle}, path: ${c.path})`));
  } catch (err) {
    console.error('Error in getCollections():', err);
  }
}

test();
