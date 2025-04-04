import axios from 'axios';
import env from '../utils/env.config.js';
import { sendBadRequest, sendError, sendSuccess } from '../utils/response.utils.js';

class KhaltiPaymentController {
  constructor() {
    this.initKhaltiPayment = this.initKhaltiPayment.bind(this);
    this.verifyKhaltiPayment = this.verifyKhaltiPayment.bind(this);
  }

  initKhaltiPayment = async (req, res) => {
    const paymentData = {
      return_url: `${env.PAYMENT_SUCCESS_URL}`,
      website_url: `${env.PAYMENT_FAILURE_URL}`,
      ...req.body,
    };

    try {
      const response = await axios.post(`${env.KHALTI_GATEWAY_URL}/epayment/initiate/`, paymentData, {
        headers: {
          'Authorization': `Key ${env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.pidx && !response.data.payment_url) {
        return sendBadRequest(res, 'Khalti payment failed to initiate', response.data);
      }

      return sendSuccess(res, 'Khalti payment initiated, open the payment URL',response.data)

    } catch (error) {
      console.error('Error initiating Khalti payment:', error);
      return sendError(res,'Payment initiation failed',error.message);
    }
  }

  verifyKhaltiPayment = async (req, res) => {
    const { pidx } = req.query;

    if (!pidx) {
      return sendError(res, 'Missing payment ID (pidx) in request.query');
    }

    const payload = {
      pidx,
    };

    try {
      const response = await axios.post(
        `${env.KHALTI_GATEWAY_URL}/epayment/lookup/`,
        payload,
        {
          headers: {
            'Authorization': `Key ${env.KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Check if payment verification was successful
      if (response.data.status !== 'Completed') {
        return sendSuccess(res, 'Payment verification failed');
      }
      return sendSuccess(res, 'Payment verified', response.data);
 
    } catch (error) {
      console.error('Error verifying Khalti payment:', error.response || error.message);
      return sendError(res, 'Error verifying payment', error.response ? error.response.data : error.message);
    }
  }
}

const khaltiPaymentController = new KhaltiPaymentController();
export default khaltiPaymentController;