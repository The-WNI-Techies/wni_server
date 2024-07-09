import express from "express";
import multer from "multer";
import UserController from "./user.controller";
import AuthMiddleware from "../auth/auth.middleware";

const user = express();

const upload = multer({ dest: `../../${__dirname}/uploads/` });

user.patch('/profile', AuthMiddleware.requireVerification, upload.single('profileAvatar'), UserController.updateProfileInfo);


export default user;