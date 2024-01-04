'use strict';

const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // OLD VERSION
    // const tokens = await keyTokenModel.create({
    //   user: userId,
    //   publicKey,
    //   privateKey,
    // });

    // return tokens ? tokens.publicKey : null;

    // NEW VERSION
    const filter = { user: userId },
      updateObj = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      },
      options = { upsert: true, new: true };

    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      updateObj,
      options,
    );

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async userId => {
    return await keyTokenModel.findOne({ user: userId });
  };

  static findByRefreshToken = async refreshToken => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static removeKeyById = async id => {
    return await keyTokenModel.findByIdAndRemove(id);
  };

  static findByRefreshTokenUsed = async refreshToken => {
    return await keyTokenModel
      .findOne({
        refreshTokensUsed: refreshToken,
      })
      .lean();
  };

  static deleteKeyByUserId = async userId => {
    return await keyTokenModel.deleteOne({ userId });
  };
}

module.exports = KeyTokenService;
