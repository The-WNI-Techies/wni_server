"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth = (0, express_1.Router)();
auth.post('/register', auth_controller_1.default.signUp);
auth.post('/sign-in', auth_controller_1.default.signIn);
auth.post('/:userID/verification-token', auth_controller_1.default.sendVerificationToken);
auth.post('/:userID/verify', auth_controller_1.default.verifyUser);
auth.post('/:userID/forgot-password', auth_controller_1.default.generatePasswordResetToken);
auth.put('/reset-password', auth_controller_1.default.resetPassword);
exports.default = auth;
