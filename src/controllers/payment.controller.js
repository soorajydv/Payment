import Stripe from 'stripe';
import request from 'request';
import env from '../utils/env.config.js';
import { sendError, sendSuccess } from '../utils/response.utils.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

/**
 * Handles eSewa payment redirection
 */
export const handleEsewaPayment = async (req, res) => {
    try {
        const {
            amount,
            tax_amount,
            product_service_charge,
            product_delivery_charge,
            total_amount,
            transaction_uuid,
            product_code,
            success_url,
            failure_url,
            signed_field_names,
            signature
        } = req.body;

        // Redirect to eSewa Payment Gateway
        return res.redirect('https://rc-epay.esewa.com.np/api/epay/main/v2/form');
    } catch (error) {
        return res.status(500).json({ message: 'eSewa Payment Failed', error: error.message });
    }
};

/**
 * Handles Stripe payment
 */
export const handleStripePayment = async (req, res) => {
    const amount = 1000; // Amount in cents
    const currency = 'usd';
    const token = 'tok_visa';
    try {
        // Create the charge with Stripe
        const charge = await stripe.charges.create({
            amount: amount * 100, // Convert amount to the smallest currency unit (e.g., cents)
            currency,
            source: token, // Token obtained from the client
            description: 'Stripe Payment',
        });
        return sendSuccess(res, 'Payment successful', charge);
    } catch (err) {
        return sendError(res, 'Payment failed', err.message);
    }
};

/**
 * Handles Khalti payment verification
 */
export const handleKhaltiPayment = async (req, res) => {

    const options = {
        method: 'POST',
        url: 'https://dev.khalti.com/api/v2/epayment/initiate/',
        headers: {
            'Authorization': `Key ${env.KHALTI_SECRET_KEY}`,
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
                payment_url: responseData.payment_url,
            });
        } else {
            return res.status(400).json({ message: 'Payment initiation failed', details: responseData });
        }
    });
};

export const handleKhaltiCallback = async (req, res) => {
    try {
        const {
            pidx,
            transaction_id,
            tidx,
            amount,
            total_amount,
            mobile,
            status,
            purchase_order_id,
            purchase_order_name
        } = req.query;

        // Check if payment was successful
        if (status !== 'Completed') {
            return res.status(400).json({ message: 'Payment was not completed' });
        }

        // Update the payment record in the database

        return res.json({ success: true, message: 'Payment verified', status });
    } catch (error) {
        return res.status(500).json({ message: 'Error processing payment callback', error: error.message });
    }
};