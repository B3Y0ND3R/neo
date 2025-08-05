const express = require('express');
const router = express.Router();
const { generateCashMemo } = require('../../controllers/shop/pdf-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');

// Route to download cash memo PDF
router.get('/cash-memo/:orderId', authMiddleware, generateCashMemo);

module.exports = router; 