import express from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { khaltiPaymentValidator, paypalOrderValidator } from '../validators/payment.validators.js';

const router = express.Router();

router.get('/esewa', paymentController.handleEsewaPayment);
router.post('/stripe', paymentController.handleStripePayment);
router.post('/khalti', khaltiPaymentValidator, paymentController.handleKhaltiPayment);
router.post('/khalti/verify', paymentController.handleKhaltiCallback);
router.post('/paypal', paypalOrderValidator, paymentController.createOrder);
router.get('/success', (req, res) => res.send('Payment successful'));
router.get('/failure', (req, res) => res.send('Payment failed'));

export default router;
