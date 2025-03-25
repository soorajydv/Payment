import  env from "./env.config.js";
import CryptoJS from 'crypto-js';

export const generateEsewaSignature = (total_amount,transaction_uuid,product_code) => {
    const secretKey = env.ESEWA_SECRET_KEY;

    // Construct the signed string
    const signedString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    // Generate the HMAC-SHA256 hash using CryptoJS
    const hash = CryptoJS.HmacSHA256(signedString, secretKey);
    
    
    // Base64 encode the result
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    console.log(hashInBase64);
    
    return hashInBase64;
};
