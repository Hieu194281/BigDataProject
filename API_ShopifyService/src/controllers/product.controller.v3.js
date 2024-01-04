'use strict';
const ProductServiceV3 = require('../services/product.service.v3');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');
const KafkaService = require('../services/kafka.service');

const ACTION = {
  SEARCH: 'search',
  VIEW: 'view',
  ADDTOCART: 'add_to_cart',
  BUY: 'buy',
};

/**
 *
 * @param {string} topic
 * @param {ACTION} action
 * @param {Number} userId
 * @param {Array} product_data
 */
const publishMessageKafka = async ({
  topic,
  action,
  product_data,
  user_id,
}) => {
  await KafkaService.init();
  await KafkaService.produceMessage(
    topic,
    JSON.stringify({
      user_id,
      products: product_data,
      timestamp: new Date().getTime(),
      action,
    }),
  );
  KafkaService.disconnect();
};

class ProductController {
  /**
   * REQUEST QUERY PARAMS
   * @param {Number} limit
   * @param {Number} page
   * @param {Number} category
   * @param {String} sort - sort = 'price,-rating_average'
   * @returns
   */
  findAllProducts = catchAsync(async (req, res, next) => {
    const data = await ProductServiceV3.findAllProducts(req.query);
    new SuccessReponse({
      message: 'Get product list successfully!',
      data: {
        total: data?.length ?? 0,
        data,
      },
    }).send(res);
  });

  getListSearchProduct = catchAsync(async (req, res, next) => {
    const data = await ProductServiceV3.searchProducts(req.params);
    new SuccessReponse({
      message: 'Search products successfully!',
      data: {
        total: data?.length ?? 0,
        data,
      },
    }).send(res);
    publishMessageKafka({
      topic: 'product',
      action: ACTION.SEARCH,
      product_data: data,
      user_id: req.headers.user_id,
    });
  });

  findProduct = catchAsync(async (req, res, next) => {
    const data = await ProductServiceV3.findProduct(req.params.product_id);
    new SuccessReponse({
      message: 'Get product detail successfully!',
      data: {
        data,
      },
    }).send(res);
    publishMessageKafka({
      topic: 'product',
      action: ACTION.VIEW,
      product_data: [data],
      user_id: req.headers.user_id,
    });
  });

  addProductsToCart = catchAsync(async (req, res, next) => {
    
    const products = [];
    for (const item of req.body.product_ids){
      console.log(item);
      const data = await ProductServiceV3.findProduct(item);
      console.log('check data: ', data);
      products.push(data);
    }
    
    publishMessageKafka({
      topic: 'product',
      action: ACTION.ADDTOCART,
      product_data: products,
      user_id: req.headers.user_id,
    });
    new SuccessReponse({
      message: 'Add products to cart successfully!',
    }).send(res);
  });

  checkoutProducts = catchAsync(async (req, res, next) => {
    
    const products = [];
    for (const item of req.body.product_ids){
      console.log(item);
      const data = await ProductServiceV3.findProduct(item);
      console.log('check data: ', data);
      products.push(data);
    }
    // req.body.product_ids.forEach(async item => {
    //   const data = await ProductServiceV3.findProduct(item);
    //   products.push(data);
    // });
    publishMessageKafka({
      topic: 'product',
      action: ACTION.BUY,
      product_data: products,
      user_id: req.headers.user_id,
    });
    new SuccessReponse({
      message: 'Checkout products successfully!',
    }).send(res);
  });

}

module.exports = new ProductController();
