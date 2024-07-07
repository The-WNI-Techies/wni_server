import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import IAppRequest from "../interfaces/IAppRequest";
import { Response } from "express";
import User from "../user/user.model";
import userValidationSchema from "../validation/userValidation";
import { compare, hash } from "bcryptjs";
import shortUUID from "short-uuid";
import { ResetPasswordToken } from "./auth.model";
import EmailService from "../emails/email.service";

class AuthController {

    private static createToken(payload: Types.ObjectId) {
        return jwt.sign({ id: payload }, process.env.JWT_SECRET as string, {
            expiresIn: 21 * 24 * 60 * 60
        })
    }

    private static generateOTP() {
        return crypto.randomUUID().split('-').map(token => {
            if(typeof token[0] === 'string') return token[0].toUpperCase();
            return token[0];
        }).join('-');
    }

    static async signUp(req:IAppRequest, res: Response) {
        let { username, email, password } = req.body;
        username = username.trim() , password = password.trim();
        if(!username || !email || !password) {
            return res.status(404).json('Username, email and password are required parameters!');
        }

        try {
            const { error } = userValidationSchema.validate({username, email, password});
            if(error) return res.status(422).json({ error: error.details[0].message }); // Return 422 for invalid requests

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
        if((!username && !email) || !password) return res.status(400).json({error: 'Username or Email and password are required!'});
        try {
            const user = await User.findOne(email ? { email } : { username });
            if(!user) return res.status(404).json({ error: 'User not found!' });

            const passwordMatch = await compare(password, user.password)
            if(!passwordMatch) return res.status(401).json({ error: `Invalid ${username ? 'username' : 'email'} or password!`})
            res.setHeader('Authorization', `Bearer ${AuthController.createToken(user._id)}`);
            return res.status(200).json({ success: 'User sign-in succesful' });
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
            if(user.verified) return res.status(400).json({ error: 'User has already been verified!' });

            const verificationToken = AuthController.generateOTP();

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
            if(vToken !== user.vToken) return res.status(401).json({ error: 'Invalid verification token!' });
            if(user.verified) return res.status(400).json({ error: 'User has already been verified!' });
            user.verified = true;
            user.save();

            res.setHeader('Authorization', `Bearer ${AuthController.createToken(user._id)}`);
            return res.status(200).json({ success: 'User verified successfully', verified: user.verified });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!'})
        }
    }

    static async generatePasswordResetToken(req: IAppRequest, res: Response) {
        const { userID } = req.params;
        const { email } = req.body;
        if(!userID || !email) return res.status(422).json({error: 'Malformed request'});

        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({error: 'User not found'});
        if(userID !== user.short_id) {
            return res.status(401).json({error: 'Unauthorized!'});
        }
        
        // Delete old tokens anytime there is a newly generated token if any to avoid duplicate error
        const oldToken = await ResetPasswordToken.exists({user: user._id});
        if(oldToken) {
            const deletedToken = await ResetPasswordToken.findOneAndDelete({user: user._id});
            if(!deletedToken) return res.status(500).json({ error: 'Error in generating reset token. Please try again' });
        }

        const userTokenStore = await ResetPasswordToken.create({ user: user._id, token: AuthController.generateOTP() });
        userTokenStore.save();

        //!Send token to user mail
        EmailService.sendPasswordResetToken(user.email, user.username, userTokenStore.token);
        return res.status(200).json({success: 'ResetPassword Token has been created', short_id: user.short_id});
        
    }

    static async resetPassword(req: IAppRequest, res: Response) {
        const { password, resetToken } = req.body;
        if(!password || !resetToken ) return res.status(422).json({ error: 'Malformed request!' });
        try {
            const passwordTokenStore = await ResetPasswordToken.findOne({ token: resetToken });
            if(!passwordTokenStore) return res.status(401).json({ error: 'Password token not found!' });
            if(passwordTokenStore.expires.valueOf() < Date.now().valueOf()) {
                await ResetPasswordToken.findOneAndDelete({ token: resetToken });
                return res.status(400).json({ error: 'Token has expired :('});
            }
            const user = await User.findById(passwordTokenStore.user);
            if(!user) return res.status(404).json({ error: 'User not found!' });

            const { error } = userValidationSchema.validate({ username: user.username, email: user.email, password });
            if(error) return res.status(400).json({ error: error.details[0].message });

            // !TODO: Make password reset atomic
            user.password = await hash(password, 10);
            // Delete reset tokens for the user before you save
            const deletedToken = await ResetPasswordToken.findOneAndDelete({ token: resetToken });
            if(!deletedToken) return res.status(400).json({ error: 'Couldn\'t update your password' })
            user.save();

            return res.status(200).json({ success: 'Password reset successful! '});

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }
}

export default AuthController;