/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of products
 *     responses:
 *       200:
 *         description: Successful response
 */
'use strict';

const express = require('express');
const { checkApiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// Check apiKey
// router.use(checkApiKey);

// Check permission
// router.use(checkPermission('0000'));

router.use('/api/v1/checkout', require('./checkout'));
// router.use('/api/v1/product', require('./product'));
router.use('/api/v1/product', require('./product/product.routes.v3'));
router.use('/api/v1/discount', require('./discount'));
router.use('/api/v1/cart', require('./cart'));
router.use('/api/v1/category', require('./category'));
router.use('/api/v1', require('./auth'));

module.exports = router;
