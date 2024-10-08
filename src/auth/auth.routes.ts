import { Router } from 'express';
import AuthController from './auth.controller';

const auth = Router();

auth.post('/register', AuthController.signUp);
auth.post('/sign-in', AuthController.signIn);
auth.post('/:userID/verification-token', AuthController.sendVerificationToken);
auth.post('/:userID/verify', AuthController.verifyUser);
auth.post('/:userID/forgot-password', AuthController.generatePasswordResetToken);
auth.put('/reset-password',  AuthController.resetPassword);
auth.post('/refresh-access', AuthController.refreshAccessToken);
auth.post('/logout', AuthController.logout);


export default auth;