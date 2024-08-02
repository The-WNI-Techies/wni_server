"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userValidationSchema = joi_1.default.object({
    username: joi_1.default.string().min(2).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).alphanum().required(),
    role: joi_1.default.string(),
    age: joi_1.default.number(),
    gender: joi_1.default.string(),
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    verified: joi_1.default.boolean(),
});
exports.default = userValidationSchema;
