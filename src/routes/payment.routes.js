import express from 'express';
import { handleStripePayment, handleKhaltiPayment, handleKhaltiCallback} from '../controllers/payment.controller.js'
import  handleEsewaPayment from '../controllers/esewa.controller.js';
const router = express.Router();

router.get('/esewa', handleEsewaPayment);
router.post('/stripe', handleStripePayment);
router.post('/khalti', handleKhaltiPayment);
router.post('/khalti/verify', handleKhaltiCallback);

export default router;
