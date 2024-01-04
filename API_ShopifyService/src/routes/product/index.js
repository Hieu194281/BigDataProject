/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *      type: object
 *      required:
 *        - product_name
 *        - product_thumb
 *        - product_price
 *        - product_quantity
 *        - product_type
 *        - product_attributes
 *      properties:
 *        product_name:
 *          type: String
 *          description: The name of product
 *
 *
 */

'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

router.get('/search/:keySearch', productController.getListSearchProduct);
router.get('/:product_id', productController.findProduct);
router.get('', productController.findAllProducts);

// authentication
router.use(authenticateV2);

// logout
router.post('', productController.createProduct);
router.patch('/:product_id', productController.updateProduct);
router.post('/publish', productController.createProduct);
router.post('/publish/:id', productController.publishProductByShop);
router.post('/unpublish/:id', productController.unPublishProductByShop);

router.get('/drafts/all', productController.getAllDraftsForShop);
router.get('/published/all', productController.getAllPublishForShop);

module.exports = router;
