import dotenv from 'dotenv';
dotenv.config();

const env = {
  BASE_URL : process.env.BASE_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  ESEWA_SUCCESS_URL: process.env.ESEWA_SUCCESS_URL,
  ESEWA_FAILURE_URL: process.env.ESEWA_FAILURE_URL,
  ESEWA_MERCHANT_CODE: process.env.ESEWA_MERCHANT_CODE,
  ESEWA_SECRET_KEY: process.env.ESEWA_SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  PORT: process.env.PORT,
  KHALTI_GATEWAY_URL: process.env.KHALTI_GATEWAY_URL,
  KHALTI_SECRET_KEY: process.env.KHALTI_SECRET_KEY,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET_KEY: process.env.PAYPAL_SECRET_KEY,
  PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL,
};

export default env;