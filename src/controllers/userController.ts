import { Request, Response } from "express";
import User from "../models/User";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import userValidationSchema from "../validation/userValidation";
import { Types } from "mongoose";

const createToken = (payload: Types.ObjectId) => {
    return jwt.sign({payload}, process.env.JWT_SECRET!, {
        expiresIn: 7 * 24 * 60 * 60 * 1000
    });
}

const signUp = async (req: Request, res: Response) => {

    const { username, email, password } = req.body;
    try {
        if (!username || !password || !email) {
            return res.status(400).json("Required parameters omitted!");
        }

        const usernameExists = await User.exists({ username });
        const mailExists = await User.exists({ email });

        if (usernameExists || mailExists) {
            console.log('Parameter exists already');
            return res.status(400).json("User already exists!");
        }
        const data = await userValidationSchema.validateAsync(req.body);
        const user = await User.create(data);
        console.log('After user creation');
        user.password = await hash(user.password, 10);
        user.save();
        return res.status(201).json("User Created!");
    } catch (error) {
        return res.status(500).json({ err: (error as Error).message });
    }
}

const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json("Required parameter(s) omitted");
        }
        const user = await User.findOne({ email })
        if (user) {
            const validPassword = await compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json('Invalid Credentials!')
            }
            res.cookie('authorization', createToken(user._id), {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,

            });
            return res.status(200).json('Login successful');

        }


    } catch (error) {
        return res.status(500).json({ err: (error as Error).message });
    }
}

export { signUp, signIn };