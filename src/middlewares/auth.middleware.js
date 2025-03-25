// import asyncHandler from 'express-async-handler';
// import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../config/env.config.js';
// import { getUserById } from '../features/auth/services/user.service.js';
// import {
//   sendBadRequest,
//   sendForbidden,
//   sendNotFound,
//   sendUnauthorized,
// } from '../utils/response.utils.js';

// export const authenticate = asyncHandler(async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Bearer token
//   if (!token) return sendUnauthorized(res, 'No token provided');

//   jwt.verify(token, JWT_SECRET, async (err, decoded) => {
//     if (err) return sendUnauthorized(res, 'Invalid or Expired token');
//     if (!decoded) return sendBadRequest(res, 'Invalid token');

//     req.userId = decoded._id;
//     req.decoded = decoded;

//     const user = await getUserById(decoded._id);
//     if (!user) return sendForbidden(res, "User doesn't exist. Please relogin");

//     if (!user.isVerified)
//       return sendForbidden(res, 'User must be verified to access the resource');

//     if (!user.isLogin) return sendForbidden(res, 'User is logged out');

//     if (user.deletedOn) return sendNotFound(res, 'User not found');

//     req.user = user;

//     next();
//   });
// });

// export const authorize = (allowedRoles) => {
//   return (req, res, next) => {
//     const role = req.user?.role;
//     if (!role) return sendForbidden(res, "User doesn't exist");
//     if (allowedRoles.includes(role)) return next();
//     return sendForbidden(res, `Access denied for ${role}`);
//   };
// };
