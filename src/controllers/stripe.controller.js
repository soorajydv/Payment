import Stripe from 'stripe';
import env from '../utils/env.config.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

class StripePaymentController {
    constructor() {
        this.stripe = new Stripe(env.STRIPE_SECRET_KEY);

        this.createPaymentIntent = this.createPaymentIntent.bind(this);
        this.verifyStripePayment = this.verifyStripePayment.bind(this);
    }

    // Create Stripe Checkout Session with dynamic currency and amount
    createPaymentIntent = async (req, res) => {
        const { amount, currency } = req.body;

        // Set a default currency if not provided
        const paymentCurrency = currency || 'usd'; // Default currency is USD

        try {
            // Create a Stripe Checkout session
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: paymentCurrency, // Use the currency passed in request body or default
                            product_data: {
                                name: 'Stripe Payment', // Product description
                            },
                            unit_amount: amount * 100, // Convert to smallest currency unit (e.g., cents)
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${env.PAYMENT_SUCCESS_URL}`,
                cancel_url: `${env.PAYMENT_FAILURE_URL}`,
            });

            // Send back the checkout session URL
            return sendSuccess(res, 'Checkout session created successfully, Click on checkoutURL to proceed payment', {
                checkout_url: session.url,
                sessionId: session.id,
            });
        } catch (err) {
            return sendError(res, 'Error creating checkout session', err.message);
        }
    }

    // Verify the payment status after the user completes payment via Stripe Checkout
    verifyStripePayment = async (req, res) => {
        const {sessionId} = req.query;

        if (!sessionId) return sendError(res, 'Missing sessionId in query params');

        try {
            // Retrieve the Checkout session from Stripe
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);

            // Check the payment status
            switch (session.payment_status) {
                case 'paid':
                    return sendSuccess(res, 'Payment successful', session);
                case 'unpaid':
                    return sendError(res, 'Payment was unsuccessful', session);
                case 'no_payment_required':
                    return sendError(res, 'No payment was required', session);
                default:
                    return sendError(res, 'Payment status unknown', session);
            }
        } catch (err) {
            return sendError(res, 'Error verifying payment', err.message);
        }
    }
}

const stripePaymentController = new StripePaymentController();
export default stripePaymentController;
