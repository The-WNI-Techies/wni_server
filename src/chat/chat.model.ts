import { model, Schema } from "mongoose";

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

export const Message = model('message', messageSchema);


const chatRoomSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true
        },
        role: {
            type: String,
            enum: [ 'regular', 'moderator' ],
            default: 'regular'
        }
    }],
    messages: [{
        type: Schema.Types.ObjectId,
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


const ChatRoom = model('chatRoom', chatRoomSchema);

export default ChatRoom;