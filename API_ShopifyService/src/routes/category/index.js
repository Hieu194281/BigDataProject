const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

router.get('', categoryController.getListCategory);
router.get('/:id/products', categoryController.getProductListByCategory);

// authentication
// router.use(authenticateV2);

module.exports = router;
