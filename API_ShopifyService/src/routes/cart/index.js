const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

router.post('', cartController.addToCart);
router.get('', cartController.getCart);
router.delete('', cartController.deleteProductInCart);
router.post('/update', cartController.updateProductInCart);

// authentication
// router.use(authenticateV2);

module.exports = router;
