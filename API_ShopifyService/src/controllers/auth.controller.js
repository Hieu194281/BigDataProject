'use strict';
const AuthService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class AccessController {
  handleRefreshToken = catchAsync(async (req, res, next) => {
    // VERSION 1
    // new SuccessReponse({
    //   message: 'Get token successfully!',
    //   data: await AuthService.handleRefreshToken(req.body.refreshToken),
    // }).send(res);

    // VERSION 2
    new SuccessReponse({
      message: 'Get token successfully!',
      data: await AuthService.handleRefreshTokenV2({
        keyStore: req.keyStore,
        user: req.user,
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  });

  signup = catchAsync(async (req, res, next) => {
    new CreatedResponse({
      message: 'Registed Successfully!',
      data: await AuthService.signup(req.body),
    }).send(res);
  });

  login = catchAsync(async (req, res, next) => {
    new SuccessReponse({ data: await AuthService.login(req.body) }).send(res);
  });

  logout = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Logout successfully!',
      data: await AuthService.logout(req.keyStore),
    }).send(res);
  });
}

module.exports = new AccessController();
