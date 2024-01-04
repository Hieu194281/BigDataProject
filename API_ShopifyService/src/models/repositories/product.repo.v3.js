const product = require('../product.model');
const { convertToObjectIdMongodb } = require('../../utils');

const updateProduct = async () => {
  function extractId(inputString) {
    try {
      const match = inputString.match(/'id':\s*(\d+)/);
      console.log(match);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      } else {
        console.error('Unable to extract id from the input string.');
        return null;
      }
    } catch (error) {
      console.error('Error extracting id:', error);
      return null;
    }
  }

  console.log(123);
  // const res = await product.find().limit(10);
  // res.forEach(product => {
  //   console.log(product.categories);
  //   console.log('--------');
  //   product.categories = JSON.parse(JSON.stringify(product.categories));
  //   product.save();
  // });

  product
    .find()
    .then(docs => {
      const promises = docs.map(doc => {
        try {
          doc.category = extractId(doc.categories);
          console.log('Save: ', doc.categories, typeof categoriesObj);
          console.log('--------');
          return doc.save();
        } catch (err) {
          console.error(
            `Error parsing JSON in document with _id ${doc._id}:`,
            err,
          );
          return Promise.resolve();
        }
      });
      return Promise.all(promises);
    })
    .then(() => {
      console.log('All documents updated successfully');
    })
    .catch(err => {
      console.error('Error:', err);
    });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query).limit(limit).skip(skip).exec();
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  // const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
  let sortBy = null;
  if (sort) {
    sortBy = sort.split(',').join(' ');
  } else {
    sortBy = { _id: 1 };
  }

  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();

  return products;
};

const findProduct = async productId => {
  const foundProduct = await product.findById(productId);

  return foundProduct;
};

const searchProductByText = async ({
  keySearch,
  limit = 10,
  page = 1,
  select,
}) => {
  // const regexSearch = new RegExp(keySearch);
  const regexSearch = `"${keySearch}"`;
  const skip = limit * (page - 1);

  const results = await product
    .find(
      {
        $text: { $search: regexSearch },
      },
      {
        score: {
          $meta: 'textScore',
        },
      },
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(skip)
    .select(select);

  return results;
};

const getProductListByCategory = async ({categoryId}) => {
  const result = await product.find({
    'categories.id': { $eq: categoryId }
  })
}

module.exports = {
  searchProductByText,
  queryProduct,
  findAllProducts,
  findProduct,
  getProductListByCategory
};
