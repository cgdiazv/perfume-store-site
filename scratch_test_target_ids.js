const { bigCommerceFetch } = require('./lib/bigcommerce');
const { getMenuQuery } = require('./lib/bigcommerce/queries/menu');

const TARGET_CATEGORIES = [
  { matchSlug: 'men', title: 'Men', pathSlug: 'men' },
  { matchSlug: 'women', title: 'Women', pathSlug: 'women' },
  { matchSlug: 'kids', title: 'Kids', pathSlug: 'kids' },
  { matchSlug: 'gift-sets-for-men', title: 'Gift Sets for Men', pathSlug: 'gift-sets-for-men' },
  {
    matchSlug: 'gift-sets-for-women',
    title: 'Gift Sets for Women',
    pathSlug: 'gift-sets-for-women'
  },
  { matchSlug: 'tester-for-men', title: 'Tester for Men', pathSlug: 'tester-for-men' },
  { matchSlug: 'tester-for-women', title: 'Tester for Women', pathSlug: 'tester-for-women' }
];

async function getTargetCategoryIds() {
  const res = await bigCommerceFetch({ query: getMenuQuery });
  const categoryTree = res.body.data.site.categoryTree;

  const ids = [];
  for (const target of TARGET_CATEGORIES) {
    const match = categoryTree.find((cat) => {
      const catSlug = cat.path.split('/').filter(Boolean).pop()?.toLowerCase() || '';
      const catName = cat.name.toLowerCase().trim();
      const targetSlug = target.matchSlug.toLowerCase();
      const targetTitle = target.title.toLowerCase();

      return (
        catSlug === targetSlug ||
        catName === targetSlug ||
        catName === targetTitle ||
        (targetSlug === 'kids' && (catSlug === 'children' || catName === 'children'))
      );
    });
    if (match) {
      ids.push(match.entityId);
    }
  }
  return ids;
}

getTargetCategoryIds().then((ids) => console.log('Target Category Entity IDs:', ids));
