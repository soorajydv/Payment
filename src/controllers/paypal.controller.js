import axios from "axios";
import { sendSuccess, sendBadRequest } from "../utils/response.utils.js";
import env from "../utils/env.config.js";

class PaypalPaymentController {
    constructor() {
        this.generateAccessToken = this.generateAccessToken.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.capturePayment = this.capturePayment.bind(this);
        this.verifyPayPalPayment = this.verifyPayPalPayment.bind(this);
    }

    async generateAccessToken() {
        try {
            const response = await axios.post(
                `${env.PAYPAL_BASE_URL}/v1/oauth2/token`,
                "grant_type=client_credentials",
                {
                    auth: { username: env.PAYPAL_CLIENT_ID, password: env.PAYPAL_SECRET_KEY },
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );
            return response.data.access_token;
        } catch (error) {
            throw new Error("Failed to generate PayPal access token: " + error.message);
        }
    }

    async createOrder(req, res) {
        try {
            const accessToken = await this.generateAccessToken();
            const requestData = {
                intent: "CAPTURE",
                purchase_units: req.body.purchase_units,
                application_context: {
                    return_url: `${env.PAYMENT_SUCCESS_URL}?method=paypal`,
                    cancel_url: `${env.PAYMENT_FAILURE_URL}?method=paypal`,
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW",
                    brand_name: "cellapp.co",
                },
            };

            const response = await axios.post(
                `${env.PAYPAL_BASE_URL}/v2/checkout/orders`,
                requestData,
                { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
            );

            return sendSuccess(res, "Order created successfully", {
                orderId: response.data.id,
                accessToken,
                checkout_url: response.data.links.find((link) => link.rel === "approve")?.href,
            });
        } catch (error) {
            return sendBadRequest(res, "Failed to create PayPal order", error.message);
        }
    }

    async capturePayment(orderId) {
        try {
            const accessToken = await this.generateAccessToken();
            const response = await axios.post(
                `${env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return response.data;
        } catch (error) {
            throw new Error("Payment capture failed: " + error.message);
        }
    }

    async verifyPayPalPayment(req, res) {
        const { orderId } = req.query;
        try {
            const accessToken = await this.generateAccessToken();
            const { data: order } = await axios.get(
                `${env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            switch (order.status) {
                case "COMPLETED":
                    return sendSuccess(res, "Payment already completed", order);
                case "APPROVED":
                    const captureResponse = await this.capturePayment(orderId);
                    if (captureResponse.status !== "COMPLETED") {
                        return sendBadRequest(res, "Payment capture failed", captureResponse);
                    }
                    return sendSuccess(res, "Payment captured successfully", captureResponse);
                case "PENDING":
                    return sendSuccess(res, "Payment is pending", order);
                case "CREATED":
                    return sendBadRequest(res, "Payment was cancelled by user", order);
                default:
                    return sendBadRequest(res, "Payment is not approved or completed yet", order);
            }
        } catch (error) {
            return sendBadRequest(res, "Error verifying PayPal payment", error.message);
        }
    }
}

const paypalPaymentController = new PaypalPaymentController();
export default paypalPaymentController;
