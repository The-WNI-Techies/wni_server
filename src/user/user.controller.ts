import { Response } from "express";
import IAppRequest from "../interfaces/IAppRequest";
import User from "./user.model";

class UserController {

    static async getUserInfo(req: IAppRequest, res: Response) {
        const { userID } = req.params;
        if(!userID) return res.status(422).json({ error: 'Mallformed request' });
        
        try {
            const user = await User.findOne({ short_id: userID });
            if(!user) return res.status(404).json({ error: 'User not found!' });
            return res.status(200).json({ success: 'User found!', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async addProfileInfo(req: IAppRequest, res: Response) {}

    static async editProfile(req: IAppRequest, res: Response) {}

    static async deleteProfile(req: IAppRequest, res: Response) {}

}

export default UserController;