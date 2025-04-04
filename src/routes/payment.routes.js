import express from 'express';
import { khaltiPaymentValidator, paypalOrderValidator, stripePaymentValidator } from '../validators/payment.validators.js';
import paypalPaymentController from '../controllers/paypal.controller.js';
import { verifyPayment } from '../controllers/verifyPayment.controller.js';
import stripePaymentController from '../controllers/stripe.controller.js';
import khaltiPaymentController from '../controllers/khalti.controller.js';

const router = express.Router();

router.post('/stripe', stripePaymentValidator, stripePaymentController.createPaymentIntent);
router.post('/khalti', khaltiPaymentValidator, khaltiPaymentController.initKhaltiPayment);
router.post('/paypal', paypalOrderValidator, paypalPaymentController.createOrder);
router.post('/verify', verifyPayment);
router.get('/success', (req, res) => res.send('Payment successful'));
router.get('/failure', (req, res) => res.send('Payment failed'));

export default router;
