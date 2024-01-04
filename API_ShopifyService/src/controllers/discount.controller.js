'use strict';

const DiscountService = require('../services/discount.service');
const catchAsync = require('../utils/catchAsync');

const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class DiscountController {
  createDiscount = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Create new discount successfully!',
      data: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  });

  getAllDiscountCodeByShop = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get all discount code successfully!',
      data: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  });

  getProductsByDiscountCode = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get all discount code successfully!',
      data: await DiscountService.getProductsByDiscountCode({
        ...req.query,
      }),
    }).send(res);
  });

  getDiscountAmount = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get discount amount successfully!',
      data: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  });

  // delet = async (req, res, next) => {
  //   new SuccessReponse({
  //     message: 'Get all discount code successfully!',
  //     data: await DiscountService.getAllDiscountCodesByShop({
  //       ...req.query,
  //       shopId: req.user.userId,
  //     }),
  //   });
  // };
}

module.exports = new DiscountController();
