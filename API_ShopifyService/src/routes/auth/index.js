'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

/**
 * @swagger
 */

// SignUp
router.post('/shop/signup', authController.signup);
router.post('/shop/login', authController.login);

// Refresh token

// authentication
router.use(authenticateV2);

// logout
router.post('/shop/logout', authController.logout);
router.post('/shop/handle-refresh-token', authController.handleRefreshToken);

module.exports = router;
