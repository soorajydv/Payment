import { z } from 'zod';
import { zodSchemaValidator } from './requestBody.validator.js';

export const validateStripePayment = z.object({
    amount: z.number().positive(),
    currency: z.enum(['usd', 'npr'])
});

export const validateEsewaPayment = z.object({
    amount: z.number().positive(),
    refId: z.string().min(1)
});

export const validateKhaltiPayment = z.object({
    token: z.string().min(1),
    amount: z.number().positive()
});

export const stripePaymentValidator = zodSchemaValidator(validateStripePayment);
export const esewaPaymentValidator = zodSchemaValidator(validateEsewaPayment);
export const khaltiPaymentValidator = zodSchemaValidator(validateKhaltiPayment);