"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userValidationSchema = joi_1.default.object({
    username: joi_1.default.string().lowercase().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().alphanum().required()
});
exports.default = userValidationSchema;
