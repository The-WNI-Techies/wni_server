import { Router } from "express";
import { signIn, signUp } from "../controllers/userController";

const router = Router();

router.post('/register', signUp);
router.post('/sign-in', signIn);

export default router;