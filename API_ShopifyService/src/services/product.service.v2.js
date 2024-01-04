'use strict';

const {
  product,
  clothing,
  electronics,
  furniture,
} = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllProducts,
  searchProductByText,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo');
const { insertInventory } = require('../models/repositories/inventory.repo');
const { removeEmptyValObject, convertToObjectIdMongodb } = require('../utils');

// Define Factory class to create product

class ProductFactory {
  static productRegistry = {}; // key - class
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product types ${type}`);

    return new productClass(payload).createProduct();

    // switch (type) {
    //   case 'Electronics':
    //     return new Electronic(payload).createProduct();
    //   case 'Clothing':
    //     return new Clothing(payload).createProduct();
    //   default:
    //     throw new BadRequestError(`Ivalid Product Type ${type}`);
    // }
  }

  static async updateProduct(type, { product_shop, product_id }, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product types ${type}`);

    return new productClass(payload).updateProduct({
      product_shop,
      product_id,
    });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    const data = await publishProductByShop({ product_shop, product_id });

    if (!data) {
      throw new BadRequestError(`Can't find product!`);
    }
    return data;
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    const data = await unPublishProductByShop({ product_shop, product_id });
    if (!data) {
      throw new BadRequestError(`Can't find product!`);
    }
    return data;
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true, isDraft: false };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByText({ keySearch });
  }

  /**
   *
   * @param {string} sort
   * @returns
   */
  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        'product_name',
        'product_price',
        'product_thumb',
        'product_shop',
      ],
    });
  }

  static async findProduct({ product_id }) {
    const data = await findProduct({ product_id, select: '-__v' });

    if (!data) throw new BadRequestError("Can't find product!");

    return data;
  }
}

// Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = convertToObjectIdMongodb(product_shop);
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });

    if (newProduct) {
      insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct({ product_shop, product_id, bodyUpdate }) {
    return await updateProductById({
      productShop: product_shop,
      productId: product_id,
      model: product,
      bodyUpdate,
    });
  }
}

// Define sub class for different product types
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) throw new BadRequestError('Create new clothing error!');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create new product error!');

    return newProduct;
  }

  async updateProduct({ product_shop, product_id }) {
    // 1. Remove attributes have null or undefined value
    console.log('[1]::', this);
    const objectParams = removeEmptyValObject(this);
    console.log('[2]::', objectParams);

    // 2. Check if update both Clothing and Product or not
    if (objectParams.product_attributes) {
      await updateProductById({
        productShop: product_shop,
        productId: product_id,
        model: clothing,
        bodyUpdate: objectParams.product_attributes,
      });
    }

    const updatedProduct = await super.updateProduct({
      product_shop,
      product_id,
      bodyUpdate: objectParams,
    });

    if (!updatedProduct) {
      throw new BadRequestError('Update product failed!');
    }

    return updatedProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic)
      throw new BadRequestError('Create new electronic error!');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new product error!');

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) throw new BadRequestError('Create new furniture error!');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create new product error!');

    return newProduct;
  }
}

// Register product types
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
