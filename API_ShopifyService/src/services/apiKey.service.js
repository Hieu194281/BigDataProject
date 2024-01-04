'use strict';

const crypto = require('crypto');
const ApiKey = require('../models/apiKey.model');

const findApiKey = async key => {
  // Create new key for testing
  // const newKey = await ApiKey.create({
  //   key: crypto.randomBytes(64).toString('hex'),
  //   permissions: ['0000'],
  // });

  const objKey = await ApiKey.findOne({ key, status: true }).lean();
  console.log('find api key: ', objKey);
  return objKey;
};

module.exports = {
  findApiKey,
};
