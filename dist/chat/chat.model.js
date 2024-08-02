"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});
exports.Message = (0, mongoose_1.model)('message', messageSchema);
const chatRoomSchema = new mongoose_1.Schema({
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    participants: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                unique: true
            },
            role: {
                type: String,
                enum: ['regular', 'moderator'],
                default: 'regular'
            }
        }],
    messages: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Message'
        }],
    mode: {
        type: String,
        enum: ['silent', 'admins_only', 'normal'],
        default: 'normal'
    },
    join_id: {
        type: String,
        required: true
    }
});
const ChatRoom = (0, mongoose_1.model)('chatRoom', chatRoomSchema);
exports.default = ChatRoom;
