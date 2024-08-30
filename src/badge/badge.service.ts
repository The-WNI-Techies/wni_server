import { Types } from "mongoose";
import IBadge from "../interfaces/IBadge";
import Badge from "./badge.model";

class BadgeController {
    
    public static async find(id: Types.ObjectId) {
        return Badge.findById(id);
    }

    public static async create(name: string, description: string, icon: string) {
        return Badge.create({ name, description, icon });
    }

    public static async edit(id: Types.ObjectId ,badge: Partial<IBadge>) {
        const updateData: Partial<IBadge> = {};
        if (badge.name) updateData.name = badge.name;
        if (badge.description) updateData.description = badge.description;
        if (badge.name) updateData.icon = badge.icon;
        
        return Badge.findByIdAndUpdate(id, updateData);
    }

    public static async remove(id: Types.ObjectId) {
        return Badge.findByIdAndDelete(id);
    }

}


export default BadgeController;