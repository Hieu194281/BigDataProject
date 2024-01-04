const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

// Get amount of discount
router.post('/amount', discountController.getDiscountAmount);
router.get(
  '/list-product-with-code',
  discountController.getProductsByDiscountCode,
);

// authentication
router.use(authenticateV2);

router.post('', discountController.createDiscount);
router.get('', discountController.getAllDiscountCodeByShop);

module.exports = router;
