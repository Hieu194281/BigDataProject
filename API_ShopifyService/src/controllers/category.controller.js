'use strict';

const CategoryService = require('../services/category.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class CategoryController {
  getListCategory = catchAsync(async (req, res, next) => {
    return new SuccessReponse({
      message: 'Get Category list successfully!',
      data: await CategoryService.getCategoryList(req.params),
    }).send(res);
  });

  getProductListByCategory = catchAsync(async (req, res, next) => {
    return new SuccessReponse({
      message: 'Get Category list successfully!',
      data: await CategoryService.getProductListByCategory(req.params),
    }).send(res);
  })
}

module.exports = new CategoryController();
