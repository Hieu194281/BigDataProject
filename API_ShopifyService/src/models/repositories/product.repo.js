const { Types } = require('mongoose');
const {
  product,
  clothing,
  electronics,
  furniture,
} = require('../product.model');

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate({
      path: 'product_shop',
      select: 'name email -_id',
    })
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();
};

const searchProductByText = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);

  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      {
        score: {
          $meta: 'textScore',
        },
      },
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return results;
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();

  return products;
};

const findProduct = async ({ product_id, select = '-__v' }) => {
  return await product.findById(product_id).select(select);
};

const updateProductById = async ({
  productShop,
  productId,
  model,
  bodyUpdate,
  isNew = true,
}) => {
  return await model.findOneAndUpdate(
    {
      product_shop: new Types.ObjectId(productShop),
      _id: new Types.ObjectId(productId),
    },
    bodyUpdate,
    {
      new: isNew,
    },
  );
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
  findAllProducts,
  searchProductByText,
  findProduct,
  updateProductById,
};
