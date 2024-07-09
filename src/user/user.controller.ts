import { Response } from "express";
import IAppRequest from "../interfaces/IAppRequest";
import User from "./user.model";
import UserService from "./user.service";
import { Types } from "mongoose";
import IUser from "../interfaces/IUser";

class UserController {

    static async getUserInfo(req: IAppRequest, res: Response) {
        const { userID } = req.params;
        if(!userID) return res.status(422).json({ error: 'Mallformed request' });
        
        try {
            const user = await User.findOne({ short_id: userID }).select([
                    'username', 
                    'email', 
                    'password', 
                    'short_id', 
                    'createdAt'
                ]);
            if(!user) return res.status(404).json({ error: 'User not found!' });
            return res.status(200).json({ success: 'User found!', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async updateProfileInfo(req: IAppRequest, res: Response) {
        const id = req.user?._id;
        const { firstName, lastName, gender, age } = req.body;
        const  profileAvatar = req.file;

        try {
            let updateData: Partial<IUser> = {};
            if(firstName) updateData.firstName = firstName;
            if(lastName) updateData.lastName = lastName;
            if(gender) updateData.gender = gender;
            if(age) updateData.age = parseInt(age);
            if(profileAvatar) updateData.profile_image_uri = profileAvatar.path;
            console.log('Update data', updateData)
            
            const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
            console.log(updatedUser);
            if(!updatedUser) return res.status(202).json({ error: 'Could not process input! Retry' });
            return res.status(200).json({success: 'Updated successfully', user: updatedUser});
        } catch (error) {
            res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async editProfile(req: IAppRequest, res: Response) {}

    static async deleteProfile(req: IAppRequest, res: Response) {}

}

export default UserController;