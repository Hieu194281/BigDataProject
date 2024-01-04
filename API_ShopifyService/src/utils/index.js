'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const removeEmptyValObject = obj => {
  let newObj = {};

  Object.keys(obj).forEach(key => {
    if (obj[key] === Object(obj[key]))
      newObj[key] = removeEmptyValObject(obj[key]);
    else if (obj[key] !== undefined && obj[key] !== null) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

module.exports = {
  getInfoData,
  removeEmptyValObject,
  convertToObjectIdMongodb,
};
