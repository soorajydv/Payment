import  env from '../utils/env.config.js';
import { generateEsewaSignature } from '../utils/esewaSignature.js';
import { v4 as uuidv4 } from 'uuid'; 

const esewaPayment = async(req, res) => {
    const amount = 100;
    const tax_amount = 10;
    const product_service_charge = 0;
    const product_delivery_charge = 0;
    const transaction_uuid = uuidv4().replace(/-/g, '');

    const total_amount = amount + tax_amount + product_service_charge + product_delivery_charge;
    const product_code = env.ESEWA_MERCHANT_CODE;
    const success_url = env.ESEWA_SUCCESS_URL;
    const failure_url = env.ESEWA_FAILURE_URL;
    const signed_field_names = "total_amount,transaction_uuid,product_code";
    const signature = generateEsewaSignature(total_amount, transaction_uuid, product_code);

    console.log({
        "amount": amount,
        "tax_amount": tax_amount,
        "product_service_charge": product_service_charge,
        "product_delivery_charge": product_delivery_charge,
        "total_amount": total_amount,
        "transaction_uuid": transaction_uuid,
        "product_code": product_code,
        "success_url": success_url,
        "failure_url": failure_url,
        "signed_field_names": signed_field_names,
        "signature": signature
    });
    
    
    return res.render('payment', {
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
    });
};

export default esewaPayment;