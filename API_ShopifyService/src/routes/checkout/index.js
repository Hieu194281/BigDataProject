const express = require('express');
const router = express.Router();
const checkoutController = require('../../controllers/checkout.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

router.post('/review', checkoutController.checkoutReview);

// authentication
// router.use(authenticateV2);

module.exports = router;
