import { Types } from "mongoose";
import IUser from "../interfaces/IUser";
import User from "./user.model";


class UserService {
    
    static async updateUserDetails(short_id: Types.ObjectId, user: Partial<IUser>) {
        try {
            const updatedUser = await User.findOneAndUpdate({ short_id }, user, { new: true });
            if(!updatedUser) throw new Error('Failed to update user information');
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;