import type {Request, Response } from 'express';
import IBadge from "../interfaces/IBadge";
import Badge from "./badge.model";
import BadgeService from "./badge.service";

class BadgeController {

    public static async createBadge(req: Request, res: Response) {
        try {

            const { name, description }: Omit<IBadge, 'icon'> = req.body;
            const badgeIcon = req.file;
            if(!badgeIcon) {
                return res.status(422).json({ error: "Icon upload failed!"});
            }
            let badge: Partial<IBadge> = { name, icon: badgeIcon?.path };

            if (description) {
                badge.description = description;
            }
            const newBadge = await BadgeService.create(badge);
            return res.status(201).json({ success: "Badge created successfully", newBadge });
        } catch (error) {
            return res.status(500).json({ error: "Error creating badge!" });
        }
    }

    public static async getAllBadges(_req: Request, res: Response) {
        try {
            const badges = await Badge.find();
            if (!badges) {
                return res.status(404).json({ error: "No badge found!" });
            }
            return res.status(200).json({ success: "Badges found", badges });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error getting badges!" });
        }
    }

    public static async editBadge(req: Request, res: Response) {
        try {
            const { badgeID } = req.params;
            const { name, description, icon }: IBadge = req.body;
            const badge: Partial<IBadge> = {};
            if (name) badge.name = name;
            if (description) badge.description = description;
            if (name) badge.icon = icon;
            const updatedBadge = await BadgeService.edit(badgeID as any, badge);
            return res.status(200).json({ success: "Badge updated successfully!", badge: updatedBadge });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    public static async deleteBadge(req: Request, res: Response) {
        try {
            const { badgeID } = req.params;
            const deletedBadge = await BadgeService.remove(badgeID as any);
            return res.status(200).json({ success: "Badge deleted successfully", badge: deletedBadge });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error deleting badge" });
        }
    }

}

export default BadgeController;