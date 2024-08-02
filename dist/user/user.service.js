"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./user.model"));
class UserService {
    static async updateUserDetails(short_id, user) {
        try {
            const updatedUser = await user_model_1.default.findOneAndUpdate({ short_id }, user, { new: true });
            if (!updatedUser)
                throw new Error('Failed to update user information');
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = UserService;
