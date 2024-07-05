import express from 'express';
import AuthController from './auth.controller';

const auth = express();

auth.post('/register', AuthController.signUp);
auth.post('/:userID/verify-email', AuthController.sendVerificationToken);


export default auth;
