import Stripe from 'stripe';
import request from 'request';
import axios from 'axios';
import env from '../utils/env.config.js';
import { sendError, sendSuccess } from '../utils/response.utils.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

class PaymentController {

    constructor() {
        this.handleEsewaPayment = this.handleEsewaPayment.bind(this);
        this.handleStripePayment = this.handleStripePayment.bind(this);
        this.handleKhaltiPayment = this.handleKhaltiPayment.bind(this);
        this.handleKhaltiCallback = this.handleKhaltiCallback.bind(this);
        this.generateAccessToken = this.generateAccessToken.bind(this);
        this.createOrder = this.createOrder.bind(this);
    }

    // Handles eSewa payment
    async handleEsewaPayment(req, res) {
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
    }

    // Handles Stripe payment
    async handleStripePayment(req, res) {
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
    }

    // Handles Khalti payment verification
    async handleKhaltiPayment(req, res) {
        const options = {
            method: 'POST',
            url: 'https://dev.khalti.com/api/v2/epayment/initiate/',
            headers: {
                'Authorization': `Key ${env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                return_url: `${env.BASE_URL}/payment/success`, //cancelled payment also falls under success but with statu = canceled
                website_url: `${env.BASE_URL}/payment/failure`,                 
                ...req.body,
            }),
        };

        request(options, (error, response) => {
            if (error) {
                console.error('Error initiating payment:', error);
                return res.status(500).json({ message: 'Payment initiation failed', error: error });
            }
            const responseData = JSON.parse(response.body);

            if (responseData.pidx) {
                return res.json({
                    message: 'Payment initiated successfully',
                    payment_url: responseData.payment_url,
                });
            } else {
                return res.status(400).json({ message: 'Payment initiation failed', details: responseData });
            }
        });
    }

    // Handle Khalti callback
    async handleKhaltiCallback(req, res) {
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

            if (status !== 'Completed') {
                return res.status(400).json({ message: 'Payment was not completed' });
            }

            return res.json({ success: true, message: 'Payment verified', status });
        } catch (error) {
            return res.status(500).json({ message: 'Error processing payment callback', error: error.message });
        }
    }

    // PayPal Controller
    async generateAccessToken(req, res) {
        const clientId = env.PAYPAL_CLIENT_ID;
        const clientSecret = env.PAYPAL_SECRET_KEY;
        try {
            const response = await axios({
                method: 'POST',
                url: env.PAYPAL_BASE_URL + '/v1/oauth2/token',
                data: 'grant_type=client_credentials',
                auth: { username: clientId, password: clientSecret },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            return response.data.access_token;
        } catch (error) {
            return res.status(500).json({ error: "Failed to authenticate with PayPal", details: error.response?.data });
        }
    }

    async createOrder(req, res) {
        const accessToken = await this.generateAccessToken(req, res);

        const requestData = {
            intent: "CAPTURE",
            purchase_units: req.body.purchase_units,
            application_context: {
                return_url: BASE_URL + "/payment/success",
                cancel_url: BASE_URL + "/payment/failure",
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                brand_name: "manfra.io"
            }
        };

        const response = await axios({
            url: env.PAYPAL_BASE_URL + '/v2/checkout/orders',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify(requestData)
        });
        return sendSuccess(res, 'Order created successfully', response.data);
    }
}

export const paymentController = new PaymentController();
