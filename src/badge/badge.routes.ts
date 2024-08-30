import { Router } from "express";
import BadgeController from "./badge.controller";
import path from "path";
import multer from "multer";

const badge = Router();

const uploadDestination = path.resolve(__dirname, "../../uploads/badges")
const upload = multer({ dest: uploadDestination });

badge.post('/create', upload.single("icon"), BadgeController.createBadge);
badge.get('/', BadgeController.getAllBadges);
badge.patch('/:badgeID', BadgeController.editBadge);
badge.delete('/:badgeID', BadgeController.deleteBadge);

export default badge;