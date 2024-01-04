const product = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
  findProduct,
  queryProduct,
  searchProductByText,
  findAllProducts,
} = require('../models/repositories/product.repo.v3');

class ProductService {
  static async searchProducts({ keySearch }) {
    keySearch = decodeURIComponent(keySearch);
    return await searchProductByText({
      keySearch,
      limit: 10,
      page: 1,
      // select: ['name', '_id', 'id', 'score'],
    });
  }

  /**
   *
   * @param {Number} limit
   * @param {Number} page
   * @param {Number} category
   * @param {String} sort - sort = 'price,-rating_average'
   * @returns
   */
  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    category,
  }) {
    const filter = {
      category,
    };

    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [],
    });
  }

  static async findProduct(productId) {
    return await findProduct(productId);
  }
}

module.exports = ProductService;
