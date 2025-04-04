import CryptoJS from 'crypto-js';
import { sendSuccess, sendError, sendBadRequest } from '../utils/response.utils.js';
import env from '../utils/env.config.js';

class EsewaPaymentController {
    
    constructor() {
        this.verifyEsewaPayment = this.verifyEsewaPayment.bind(this);
        this.generateEsewaSignature = this.generateEsewaSignature.bind(this);
    }

    generateEsewaSignature = async (total_amount, transaction_uuid, product_code) => {
        // Correct format for string to sign (values only, concatenated with '&')
        const stringToSign = `${total_amount}&${transaction_uuid}&${product_code}`;
    
        const hash = CryptoJS.HmacSHA256(stringToSign, env.ESEWA_SECRET_KEY);
        const signature = CryptoJS.enc.Base64.stringify(hash);
    
        return signature;
    }    
    
    verifyEsewaPayment = async(req, res) =>{
        const {token} = req.body;

        if(!token) {
            return sendBadRequest(res,"Token not provided, please provide a valid token provided in esewa return URL");
        }

        const queryBody = Buffer.from(token, 'base64').toString('ascii');
        const paymentResponse = JSON.parse(queryBody);

        if(paymentResponse.status !== "COMPLETE") {
            return sendError(res,"Payment not complete");
        }
  
        return sendSuccess(res,'Payment verified successfully',paymentResponse);
    }
}

const esewaPaymentController = new EsewaPaymentController();
export default esewaPaymentController;
