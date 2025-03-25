import { sendBadRequest } from "../utils/response.utils.js";

export const zodSchemaValidator = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return sendBadRequest(res, `${errors[0].path}: ${errors[0].message}`);
    }

    req.body = result.data;
    next();
  };
};
