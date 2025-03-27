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
    amount: z.number().positive(),
    purchase_order_id: z.string().min(1, "Purchase Order ID is required"), // Unique order ID
    purchase_order_name: z.string().min(1, "Purchase Order Name is required"), // Order name
    customer_info: z.object({
      name: z.string().min(5, "Customer name is required"),
      email: z.string().email("Invalid email format"),
      phone: z.string().regex(/^\d{10}$/, "Phone number must be a valid 10-digit number")
    })
});

export const paypalOrderSchema = z.object({
    purchase_units: z.array(
        z.object({
            items: z.array(
                z.object({
                    name: z.string().min(1, "Item name is required"),
                    description: z.string().optional(),
                    quantity: z.number().int().positive("Quantity must be a positive integer"),
                    unit_amount: z.object({
                        currency_code: z.string().length(3, "Currency code must be 3 characters"),
                        value: z.string().regex(/^\d+(\.\d{2})?$/, "Value must be a valid price format")
                    })
                })
            ),
            amount: z.object({
                currency_code: z.string().length(3, "Currency code must be 3 characters"),
                value: z.string().regex(/^\d+(\.\d{2})?$/, "Value must be a valid price format"),
                breakdown: z.object({
                    item_total: z.object({
                        currency_code: z.string().length(3),
                        value: z.string().regex(/^\d+(\.\d{2})?$/)
                    })
                })
            })
        })
    )
});

export const stripePaymentValidator = zodSchemaValidator(validateStripePayment);
export const esewaPaymentValidator = zodSchemaValidator(validateEsewaPayment);
export const khaltiPaymentValidator = zodSchemaValidator(validateKhaltiPayment);
export const paypalOrderValidator = zodSchemaValidator(paypalOrderSchema);