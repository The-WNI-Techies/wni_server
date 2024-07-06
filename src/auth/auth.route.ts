import express from 'express';
import AuthController from './auth.controller';
import AuthMiddleware from './auth.middleware';

const auth = express();

auth.post('/register', AuthController.signUp);
auth.post('/:userID/verification-token', AuthController.sendVerificationToken);
auth.post('/:userID/verify', AuthController.verifyUser);
auth.post('/:userID/get-password-reset-token', AuthController.generatePasswordResetToken);
auth.post('/:userID/reset-password', AuthController.verifyPasswordReset); // userID here is the actual user_id not short_id
auth.put('/:userID/reset-password', AuthMiddleware.canResetPassword,  AuthController.resetPassword);


export default auth;