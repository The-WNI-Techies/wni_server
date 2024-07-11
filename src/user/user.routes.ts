import { Router } from "express";
import multer from "multer";
import UserController from "./user.controller";
import AuthMiddleware from "../auth/auth.middleware";

const router = Router();

const uploadDestination = `/home/yemi/Projects/wni_server/uploads/`
const upload = multer({ dest:  uploadDestination });

router.get('/', UserController.getAllUsers);
router.get('/search', UserController.searchUsers);
router.get('/admins', UserController.getAdmins);
router.get('/profile', UserController.getUserInfo);
router.patch('/profile', AuthMiddleware.requireVerification, upload.single('profileAvatar'), UserController.updateProfileInfo);
router.delete('/delete_profile', AuthMiddleware.requireVerification, UserController.deleteProfile);



export default router;