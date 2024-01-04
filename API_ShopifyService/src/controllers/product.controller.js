'use strict';
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.v2');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class ProductController {
  createProduct = catchAsync(async (req, res, next) => {
    console.log('user:', req.user);
    // new SuccessReponse({
    //   message: 'Create new product successfully!',
    //   data: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    new SuccessReponse({
      message: 'Create new product successfully!',
      data: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  });

  updateProduct = catchAsync(async (req, res, next) => {
    console.log('user:', req.user);
    new SuccessReponse({
      message: 'Update product successfully!',
      data: await ProductServiceV2.updateProduct(
        req.body.product_type,
        {
          product_shop: req.user.userId,
          product_id: req.params.product_id,
        },
        req.body,
      ),
    }).send(res);
  });

  getAllDraftsForShop = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get draft product list successfully!',
      data: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  });

  getAllPublishForShop = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get published product list successfully!',
      data: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  });

  publishProductByShop = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Publish product successfully!',
      data: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  });

  unPublishProductByShop = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Unpublish product successfully!',
      data: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  });

  getListSearchProduct = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get products successfully!',
      data: await ProductServiceV2.searchProducts(req.params),
    }).send(res);
  });

  findAllProducts = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get products successfully!',
      data: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  });

  findProduct = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get product successfully!',
      data: await ProductServiceV2.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  });
}

module.exports = new ProductController();
