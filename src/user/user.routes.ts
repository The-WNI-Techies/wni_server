import { Router } from "express";
import multer from "multer";
import UserController from "./user.controller";
import AuthMiddleware from "../auth/auth.middleware";

const router = Router();

const upload = multer({ dest: `/home/yemi/Projects/wni_server/uploads/` });

router.patch('/profile', AuthMiddleware.requireVerification, upload.single('profileAvatar'), UserController.updateProfileInfo);


export default router;