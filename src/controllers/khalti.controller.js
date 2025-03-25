import request from 'request';
import { env } from '../utils/env.config.js';

export const initiatePayment = (req, res) => {
  console.log(env.KHALTI_SECRET_KEY);
  
  const options = {
    method: 'POST',
    url: 'https://dev.khalti.com/api/v2/epayment/initiate/',
    headers: {
      'Authorization':`Key ${env.KHALTI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      return_url: 'http://google.com/', // Replace with your actual return URL
      website_url: 'https://facebook.com/', // Replace with your actual website URL
      amount: '1000', // Amount in paisa (1000 = 10.00 NPR)
      purchase_order_id: 'Order01', // Unique order ID
      purchase_order_name: 'Test Order', // Order name
      customer_info: {
        name: 'Ram Bahadur', // Customer's name
        email: 'test@khalti.com', // Customer's email
        phone: '9800000001', // Customer's phone number
      },
    }),
  };

  request(options, (error, response) => {
    if (error) {
      console.error('Error initiating payment:', error);
      return res.status(500).json({ message: 'Payment initiation failed', error: error });
    }
    // Parse the response from Khalti (if needed)
    const responseData = JSON.parse(response.body);
    console.log('Khalti Response:', responseData);

    // You can handle further response, like redirecting the user or processing the data
    if (responseData.pidx) {
      return res.json({
        message: 'Payment initiated successfully',
        token: responseData.token, // Token from Khalti API
      });
    } else {
      return res.status(400).json({ message: 'Payment initiation failed', details: responseData });
    }
  });
};
