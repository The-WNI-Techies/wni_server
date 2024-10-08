import { Router } from "express";
import multer from "multer";
import UserController from "./user.controller";
import AuthMiddleware from "../auth/auth.middlewares";
import path from "path";

const router = Router();

const uploadDestination = path.resolve(__dirname, '../../uploads/profiles')
const upload = multer({ dest:  uploadDestination });

router.get('/', UserController.getAllUsers);
router.get('/search', UserController.searchUsers);
router.get('/admins', UserController.getAdmins);
router.post('/add-badge', AuthMiddleware.requireVerification, UserController.addBadge)
router.get('/profile', UserController.getUserInfo);
router.patch('/profile', AuthMiddleware.requireVerification, upload.single('profileAvatar'), UserController.updateProfileInfo);
router.delete('/delete_profile', AuthMiddleware.requireVerification, UserController.deleteProfile);

export default router;