import type IAppRequest from "../interfaces/IAppRequest";
import type { Response } from 'express';
import IBadge from "../interfaces/IBadge";
import Badge from "./badge.model";

class BadgeController {

    public static async createBadge(req: IAppRequest, res: Response) {
        try {
            //! TODO => implement badge icons upload
            const { name, description, icon }: IBadge = req.body;
            let badge: Partial<IBadge> = { name, icon };

            if (description) {
                badge.description = description;
            }
            const newBadge = await Badge.create(badge);
            if (!newBadge) throw new Error("Error creating badge!");
            return res.status(201).json({ success: "Badge created successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Error creating badge!" });
        }


    }

    public static async getAllBadges(req: IAppRequest, res: Response) {
        try {
            const badges = await Badge.find();
            if(!badges) {
                return res.status(404).json({ error: "No badge found!" });
            }
            return res.status(200).json({ success: "Badges found", badges });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error getting badges!" });
        }
    }

    public static async editBadge(req: IAppRequest, res: Response) { 
        const id = req.params;
        
    }

    public static async deleteBadge(req: IAppRequest, res: Response) { }

}

export default BadgeController;