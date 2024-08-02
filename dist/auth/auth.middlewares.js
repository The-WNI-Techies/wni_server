"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../user/user.model"));
class AuthMiddleware {
    static async requireAuth(req, res, next) {
        const authToken = req.headers.authorization?.split(' ')[1];
        if (!authToken)
            return res.status(401).json({ error: 'Unauthorized! ' });
        const decodedToken = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
        if (!decodedToken)
            return res.status(400).json({ error: 'Unauthorized!' });
        const { id } = decodedToken;
        try {
            const user = await user_model_1.default.findById(id);
            if (!user)
                return res.status(404).json({ error: 'User not found!' });
            req.user = user;
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        next();
    }
    static async requireVerification(req, res, next) {
        const id = req.user?._id;
        if (!id)
            return res.status(422).json({ error: 'Malformed request! userID required' });
        try {
            const user = await user_model_1.default.findById(id);
            if (!user)
                return res.status(404).json({ error: 'User not found!' });
            if (!user.verified)
                return res.status(400).json({ error: 'User is not verified!' });
            next();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
        next();
    }
}
exports.default = AuthMiddleware;
