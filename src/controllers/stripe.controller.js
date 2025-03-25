import Stripe from 'stripe';
import { env } from '../utils/env.config.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

import { sendSuccess, sendError } from '../utils/response.utils.js';

export const stripePayment = async (req, res) => {
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
