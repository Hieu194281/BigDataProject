'use strict';

const { findApiKey } = require('../services/apiKey.service');

const HEADER = require('../utils/constants/header');

const checkApiKey = async (req, res, next) => {
  try {
    // 1. Check if req header contains apiKey or not?
    const apiKey = req.headers[HEADER.API_KEY]?.toString();

    if (!apiKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    // 2. Check if key existed in DB
    const objKey = await findApiKey(apiKey);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    req.objKey = objKey;
    return next();
  } catch (err) {
    console.log('Check Api key error:', err);
    next(err);
  }
};

const checkPermission = permission => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission Denied',
      });
    }

    const isPermissionValid = req.objKey.permissions.includes(permission);

    if (!isPermissionValid) {
      return res.status(403).json({
        message: 'Permission Denied',
      });
    }

    return next();
  };
};

module.exports = {
  checkApiKey,
  checkPermission,
};
