'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller.v3');

router.get('', ProductController.findAllProducts);
router.get('/:product_id', ProductController.findProduct);
router.get('/search/:keySearch', ProductController.getListSearchProduct);
router.post('/add-to-cart', ProductController.addProductsToCart);
router.post('/checkout', ProductController.checkoutProducts);

module.exports = router;
