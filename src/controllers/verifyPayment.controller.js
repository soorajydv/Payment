import paypalPaymentController from "./paypal.controller.js";
import stripePaymentController from "./stripe.controller.js";
import { sendBadRequest } from "../utils/response.utils.js";
import esewaPaymentController from "./esewa.controller.js";
import khaltiPaymentController from "./khalti.controller.js";

export const verifyPayment = async(req, res) => {
    const { method } = req.query;
    if (method === "paypal") return paypalPaymentController.verifyPayPalPayment(req, res);
    if (method === "stripe") return stripePaymentController.verifyStripePayment(req, res);
    if (method === "esewa") return esewaPaymentController.verifyEsewaPayment(req, res);
    if (method === "khalti") return khaltiPaymentController.verifyKhaltiPayment(req, res);
    return sendBadRequest(res, "Unsupported payment method");
}