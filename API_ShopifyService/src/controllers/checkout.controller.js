'use strict';

const CheckoutService = require('../services/checkout.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class CheckoutController {
  checkoutReview = catchAsync(async (req, res, next) => {
    return new SuccessReponse({
      message: 'Check out review',
      data: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  });
}

module.exports = new CheckoutController();
