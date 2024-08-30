import { model, Schema } from "mongoose";

const badgeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    icon: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Badge = model('badges', badgeSchema);

export default Badge;