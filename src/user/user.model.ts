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
    }
}, { timestamps: true });

const User = model('user', userSchema);

export default User;