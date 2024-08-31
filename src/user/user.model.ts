import { required } from "joi";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    age: {
        type: Number
    },
    profile_image_uri: {
        type: String,
        default: "http://file_server.com/profile_img"
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'super_user', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
        unique: true,
    },
    badges: [{
        type: Schema.Types.ObjectId,
        ref: "Badge"
    }],
    gender: {
        type: String,
        enum: ['F', 'M']
    },
    vToken: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    short_id: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User = model('user', userSchema);

export default User;