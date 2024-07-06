import express from 'express';
import AuthController from './auth.controller';

const auth = express();

auth.post('/register', AuthController.signUp);
auth.post('/:userID/verification-token', AuthController.sendVerificationToken);
auth.post('/:userID/verify', AuthController.verifyUser);
auth.post('/:userID/trigger-reset', AuthController.generatePasswordResetToken);


export default auth;