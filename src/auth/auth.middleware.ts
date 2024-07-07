import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import IAppRequest from "../interfaces/IAppRequest";
import { Types } from "mongoose";
import User from "../user/user.model";
import { ResetPasswordToken } from "./auth.model";


class AuthMiddleware {

    static async requireAuth(req: IAppRequest, res: Response, next: NextFunction) {
        const authToken = req.headers.authorization?.split(' ')[1];
        if(!authToken) return res.status(401).json({ error: 'Unauthorized! '});
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET as string);
        if(!decodedToken) return res.status(400).json({ error: 'Unauthorized!'});
        const { id } = decodedToken as any as Types.ObjectId;
        try {
            const user = await User.findById(id);
            if(!user) return res.status(404).json({ error: 'User not found!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error'});
        }
        next();
    }

    static async requireVerification(req: IAppRequest, res: Response, next: NextFunction ) { 
        const { userID } = req.params;
        if(!userID) return res.status(422).json({ error: 'Malformed request! userID required' });
        try {
            const user = await User.findOne({ short_id: userID });
            if(!user) return res.status(404).json({ error: 'User not found!' });
            if(!user.verified) return res.status(400).json({ error: 'User is not verified!' });
            next()
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
        
        next() 
    }

}

export default AuthMiddleware;