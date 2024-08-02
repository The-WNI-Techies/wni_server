"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const roomValidationSchema = joi_1.default.object({
    creator: joi_1.default.required(),
    hosts: joi_1.default.required(),
    name: joi_1.default.string().required().min(2),
    description: joi_1.default.string().min(5).max(50),
    participants: joi_1.default.array(),
    messages: joi_1.default.array(),
    join_link: joi_1.default.string()
});
exports.default = roomValidationSchema;
