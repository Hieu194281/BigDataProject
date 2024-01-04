'use strict';

const { Types } = require('mongoose');
const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const HEADER = require('../utils/constants/header');
const { NotFoundError, AuthFailureError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // 1. create accessToken & refreshToken via privateKey
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    });

    // Test
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log('Error verify:', err);
      } else {
        console.log('Decode verify:', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (err) {}
};

const authenticate = catchAsync(async (req, res, next) => {
  // 1. Getting token and userId and checking if it existed
  // 2. Verify token
  // 3. Check if user/shop still exist or not
  // 4. Check keyStore existed with userId
  // 5. Check if user/shop changed password after the JWT was issued

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  const accessToken = req.headers[HEADER.AUTHORIZATION].split(' ')[1];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decoded = await promisify(JWT.verify)(
      accessToken,
      keyStore.publicKey,
    );
    if (userId !== decoded.userId) throw new AuthFailureError('Invalid userId');
    req.keyStore = keyStore;

    return next();
  } catch (err) {
    throw err;
  }
});

const authenticateV2 = catchAsync(async (req, res, next) => {
  // 1. Getting token and userId and checking if it existed
  // 2. Verify token
  // 3. Check if user/shop still exist or not
  // 4. Check keyStore existed with userId
  // 5. Check if user/shop changed password after the JWT was issued

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodedUser = await promisify(JWT.verify)(
        refreshToken,
        keyStore.privateKey,
      );
      if (userId !== decodedUser.userId)
        throw new AuthFailureError('Invalid userId');

      req.keyStore = keyStore;
      req.user = decodedUser;
      req.refreshToken = refreshToken;

      return next();
    } catch (err) {
      throw err;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION].split(' ')[1];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decoded = await promisify(JWT.verify)(
      accessToken,
      keyStore.publicKey,
    );
    if (userId !== decoded.userId) throw new AuthFailureError('Invalid userId');
    req.keyStore = keyStore;
    req.user = decoded;

    return next();
  } catch (err) {
    throw err;
  }
});

const verifyJWT = async (token, key) => {
  return JWT.verify(token, key);
};

module.exports = {
  createTokenPair,
  authenticate,
  authenticateV2,
  verifyJWT,
};
