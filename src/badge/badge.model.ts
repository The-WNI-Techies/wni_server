import { required, string } from "joi";
import { model, Schema } from "mongoose";

// type BadgeDocument = typeof badgeSchema & Document;
const badgeSchema = new Schema({
    name: {
        type: string,
        required: true,
        unique: true
    },
    description: {
        type: string
    },
    icon:{
        type: string,
        required: true
    }
})

const Badge = model('badges', badgeSchema);

export default Badge;