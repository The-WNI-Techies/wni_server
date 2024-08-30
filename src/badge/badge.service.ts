import { Types } from "mongoose";
import IBadge from "../interfaces/IBadge";
import Badge from "./badge.model";

class BadgeService {
    
    public static async create(badge: Partial<IBadge>) {
        const newBadge = await Badge.create(badge);
        if(!newBadge) throw new Error("Error creating badge");
        return newBadge;

    }

    public static async edit(id: Types.ObjectId, badge: Partial<IBadge>) {
        const updatedBadge = await Badge.findByIdAndUpdate(id, badge, {new: true});
        if(!updatedBadge) throw new Error("Error updatng badge");
        return updatedBadge;
    }

    public static async remove(id: Types.ObjectId) {
        const badge =  await Badge.findByIdAndDelete(id);
        if(!badge) {
            throw new Error("Error deleting badge")
        }
        return badge;
    }

}


export default BadgeService;