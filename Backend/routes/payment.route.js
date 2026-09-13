import express from 'express';
import optionalAuth from '../middleware/optionalAuth.middleware.js';
import {
  getRazorpayKey,
  createOrder,
  verifyPayment,
  updateRazorpayConfig,
} from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/key', optionalAuth, getRazorpayKey);
router.post('/config', optionalAuth, updateRazorpayConfig);
router.post('/create-order', optionalAuth, createOrder);
router.post('/verify', optionalAuth, verifyPayment);

export default router;
