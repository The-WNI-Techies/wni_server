import { Request, Response } from "express";
import User from "./user.model";
import IUser from "../interfaces/IUser";
import { isValidObjectId, Types } from "mongoose";
import Badge from "../badge/badge.model";

class UserController {

    static async getUserInfo(req: Request, res: Response) {
        const { userID } = req.params;
        if (!userID) return res.status(422).json({ error: 'Mallformed request' });

        try {
            const user = await User.findOne({ short_id: userID });
            if (!user) return res.status(404).json({ error: 'User not found!' });
            return res.status(200).json({ success: 'User found!', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async updateProfileInfo(req: Request, res: Response) {
        const id = req.user?._id;
        const { firstName, lastName, gender, age } = req.body;
        const profileAvatar = req.file;

        try {
            let updateData: Partial<IUser> = {};
            if (firstName) updateData.firstName = firstName;
            if (lastName) updateData.lastName = lastName;
            if (gender) updateData.gender = gender;
            if (age) updateData.age = parseInt(age);
            if (profileAvatar) updateData.profile_image_uri = profileAvatar.path;

            const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedUser) return res.status(202).json({ error: 'Could not process input! Retry!' });
            return res.status(200).json({ success: 'Updated successfully', user: updatedUser });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async deleteProfile(req: Request, res: Response) {
        const id = req.user?._id;
        try {
            await User.findByIdAndDelete(id);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error deleting user!' });
        }

    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            let page: any = req.query.page;
            page = parseInt(page as string) || 1;
            const limit = 5;
            const skipValue = (page - 1) * limit;
            const userCount = await User.countDocuments();
            const pagesCount = Math.ceil(userCount / limit);

            const users = await User.find().sort().skip(skipValue).limit(limit);
            return res.status(200).json({ success: 'Users found!', users, remaining_pages: pagesCount - page })

        } catch (error) {
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async getAdmins(_req: Request, res: Response) {
        try {
            const admins = await User.find({ role: 'admin' });
            if (!admins) return res.status(400).json({ error: 'Could not get admins' });
            return res.status(200).json({ success: 'Admins found', admins });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }

    }

    static async searchUsers(req: Request, res: Response) {
        const { name } = req.query;
        try {
            if (!name?.toString().trim()) {
                return res.status(422).json({ error: 'Search arguments not provided' })
            }
            const nameQuery = new RegExp(`${name.toString().trim()}`, 'i');
            const matchedUsers = await User.find({ username: nameQuery });
            if (matchedUsers.length < 1) {
                return res.status(404).json({ error: 'No user found!' })
            }
            return res.status(200).json({ success: 'Users found', matches: matchedUsers });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error!' })
        }
    }

    static async addBadge(req: Request, res: Response) {
        try {
            const userId = req.user?.id as any as Types.ObjectId;
            const { badge } = req.body;
            if (!isValidObjectId(userId)) {
                return res.status(404).json({ error: "User not found!" })
            }
            const badgeExists = Badge.exists({ name: badge });
            if (!badgeExists) {
                return res.status(422).json({ error: "Badge not found" });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(422).json({ error: "User not found!" });
            }
            //! TODO => Check if user dont already have that badge before adding
            user.badges = [...user.badges, badge];
            await user.save();
            return res.status(200).json({ success: "Badge added successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default UserController;