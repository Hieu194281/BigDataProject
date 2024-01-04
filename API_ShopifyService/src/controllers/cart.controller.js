'use strict';

const CartService = require('../services/cart.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class CartController {
  addToCart = catchAsync(async (req, res, next) => {
    return new SuccessReponse({
      message: 'Add to cart successfully',
      data: await CartService.addToCart(req.body),
    }).send(res);
  });

  updateProductInCart = catchAsync(async (req, res, next) => {
    return new SuccessReponse({
      message: 'Update cart successfully',
      data: await CartService.updateProductInCart(req.body),
    }).send(res);
  });

  deleteProductInCart = catchAsync(async (req, res, next) => {
    return new SuccessReponse({
      message: 'Delete product in cart successfully',
      data: await CartService.deleteProductInUserCart(req.body),
    }).send(res);
  });

  getCart = catchAsync(async (req, res, next) => {
    return new SuccessReponse({
      message: 'Get cart successfully',
      data: await CartService.getUserCart(req.body),
    }).send(res);
  });
}

module.exports = new CartController();
