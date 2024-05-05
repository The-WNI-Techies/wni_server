"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = require("bcrypt");
const userValidation_1 = __importDefault(require("../validation/userValidation"));
const console_1 = require("console");
class UserController {
    async signup(req, res) {
        let { username, email, password } = req.body;
        username = username.toLowerCase().trim();
        email = email.trim();
        const validation = userValidation_1.default.validate({ username, email, password });
        if (validation.error) {
            return res.status(400).json({ mssg: console_1.error });
        }
        try {
            const usernameExists = await user_model_1.default.exists({ username });
            const mailExists = await user_model_1.default.exists({ email });
            if (usernameExists || mailExists) {
                return res.status(400).json("User already exists with that property");
            }
            const user = await user_model_1.default.create({ username, email, password });
            user.password = await (0, bcrypt_1.hash)(user.password, 10);
            return res.status(201).json({ "mssg": "User creation successful!", id: user._id });
        }
        catch (error) {
            return res.status(500).send({ mssg: "Internal Server Error!", err: error });
        }
    }
    signin() { }
    editUserDetails(_req, _res) { }
    deleteUser(_req, _res) { }
}
exports.default = UserController;
