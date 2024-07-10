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

export const messageModel = model('message', messageSchema);


const chatRoomSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hosts: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true   
    }],
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }]
});


const chatRoomModel = model('chatRoom', chatRoomSchema);

export default chatRoomModel;