import { Router } from "express";
import BadgeController from "./badge.controller";

const badge = Router();

badge.post('/create', BadgeController.createBadge );
badge.get('/', BadgeController.getAllBadges);
badge.put('/:badgeID', BadgeController.editBadge);
badge.delete('/:badgeID', BadgeController.deleteBadge);

export default badge;