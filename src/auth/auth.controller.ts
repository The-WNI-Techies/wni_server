import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import IAppRequest from "../interfaces/IAppRequest";
import { Response } from "express";
import User from "../user/user.model";
import userValidationSchema from "../validation/userValidation";
import { hash } from "bcryptjs";
import shortUUID from "short-uuid";
import { ResetPasswordToken } from "./auth.model";
import EmailService from "../emails/email.service";

class AuthController {
    private static createToken(payload: Types.ObjectId) {
        return jwt.sign({ id: payload }, process.env.JWT_SECRET as string, {
            expiresIn: 21 * 24 * 60 * 60
        })
    }

    static async signUp(req:IAppRequest, res: Response) {
        let { username, email, password } = req.body;
        username = username.trim() , password = password.trim();
        if(!username || !email || !password) {
            return res.status(404).json('Username, email and password are required parameters!');
        }

        try {
            const { error } = userValidationSchema.validate({username, email, password});
            if(error) return res.status(422).json({error: error}); // Return 422 for invalid requests

            const usernameTaken = await User.exists({ username });
            const mailTaken = await User.exists({ email });
            if(usernameTaken) return res.status(400).json({error: 'Username taken!'});
            if(mailTaken) return res.status(400).json({error: 'Email taken!'});

            const user = await User.create({ username, email, password });
            user.password = await hash(password, 10);
            user.short_id = shortUUID.generate();
            user.save();
            
            res.status(201).json({ success: 'User created successfully', short_id: user.short_id });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }

    }

    static async signIn(req: IAppRequest, res: Response) {
        const { username, email, password } = req.body;
        if((!username && !email) || !password) {
            return res.status(400).json({error: 'Username or Email and password are required!'});
        }

        try {
            const user = await User.findOne(email ? { email } : { username });
            if(!user) return res.status(404).json({ error: 'User not found!' });
            res.setHeader('Authorization', `Bearer ${this.createToken(user._id)}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json('Internal server error!');
        }
    }

    static async sendVerificationToken(req: IAppRequest, res: Response) {
        const { userID } = req.params;
        const { email } = req.body;

        if(!email) return res.status(400).json({ error: 'Email required!' });
        try {
            const user = await User.findOne({ email });
            if(!user) return res.status(404).json({ error: 'User not found!' });

            if(userID !== user.short_id) return res.status(401).json({error: 'Unauthorized!'});
            const verificationToken = crypto.randomUUID().split('-').map(token => {
                if(typeof token[0] === 'string') return token[0].toUpperCase();
                return token[0];
            }).join('-');

            user.vToken = verificationToken;
            user.save();

            EmailService.sendVerificationEmail(user.email, user.username, user.vToken);
            return res.status(200).json({success: 'Check your mail for verification token'});
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error!' });
        }
        
        
        
    }

    static async verifyUser(req: IAppRequest, res: Response) {
        const { vToken } = req.body;
        const { userID } = req.params;

        try {
            const user = await User.findOne({ short_id: userID });
            if(!user) return res.status(404).json({ error: 'User not found!' });
            if((vToken as string | null | undefined )  !== user.vToken) return res.status(401).json('Invalid verification token!');
            user.verified = true;
            user.save();

            return res.status(200).json({ success: 'User verified successfully', verified: user.verified });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!'})
        }
        
;

        // res.setHeader('Authorization', `Bearer ${this.createToken(user._id)}`);
    }

    static async generatePasswordResetToken(req: IAppRequest, res: Response) {
        const { userID } = req.params;
        const { email } = req.body;
        if(!userID || !email) return res.status(422).json({error: 'Malformed request'});

        const user = await User.findOne({ email});
        if(!user) return res.status(404).json({error: 'User not found'});
        if(userID !== user.short_id) {
            return res.status(401).json({error: 'Unauthorized!'});
        }
        const userTokenStore = await ResetPasswordToken.create({ user: user._id, token: crypto.randomUUID() });
        userTokenStore.save();

        //!Send token to user mail
        return res.status(200).json({success: 'ResetPassword Token has been created', token: userTokenStore.token});
        
    }

    static async resetPassword(req: IAppRequest, res: Response) {
        // ! TODO Write Password reset logic
        return res.status(204).json();
    }
}

export default AuthController;