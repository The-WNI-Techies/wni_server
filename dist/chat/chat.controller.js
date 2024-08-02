"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = __importStar(require("./chat.model"));
const mongoose_1 = require("mongoose");
const roomValidation_1 = __importDefault(require("../validation/roomValidation"));
const short_uuid_1 = __importDefault(require("short-uuid"));
class ChatController {
    static async createRoom(req, res) {
        const { name, description } = req.body;
        const id = req.user?._id;
        try {
            const roomData = { name, creator: id, join_id: short_uuid_1.default.uuid() };
            if (description)
                roomData.description = description;
            const { error } = roomValidation_1.default.validate(roomData);
            if (error) {
                return res.status(422).json({ error: error.details[0].message });
            }
            const room = await chat_model_1.default.create(roomData);
            await room.save();
            return res.status(201).json({ success: 'Room created successfully' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error creating room, try again' });
        }
    }
    static async allRooms(req, res) {
        const { page, limit } = req.query;
        try {
            const currentPage = parseInt(page) || 1;
            const limitInt = parseInt(limit) || 20;
            const pages = await chat_model_1.default.countDocuments();
            if (currentPage > pages) {
                return res.status(404).json({ error: 'Page does not exist' });
            }
            const rooms = await chat_model_1.default.find().skip(currentPage - 1).limit(limitInt);
            if (!rooms) {
                return res.status(404).json({ error: 'No rooms found!' });
            }
            return res.status(200).json({ success: 'Rooms found!', pages_left: pages - currentPage });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }
    static async searchRooms(req, res) {
        const { name } = req.query;
        try {
            if (!name || !name.toString().trim()) {
                return res.status(422).json({ error: 'No search argument provided!' });
            }
            const roomQuery = new RegExp(`${name?.toString().trim()}`, 'i');
            const matched = await chat_model_1.default.find({ name: roomQuery });
            if (!matched) {
                return res.status(404).json({ error: 'No room found!' });
            }
            return res.status(200).json({ success: 'Match(es) found!', matches: matched });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }
    static async editRoom(req, res) {
        const { name, description, mode, join_id } = req.body;
        const roomID = req.params;
        try {
            let roomData = {};
            if (name)
                roomData.name = name;
            if (description)
                roomData.description = description;
            if (mode)
                roomData.mode = mode;
            if (join_id)
                roomData.join_id = join_id;
            const { error } = roomValidation_1.default.validate(roomData);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            await chat_model_1.default.findByIdAndUpdate(roomID, roomData, { new: true });
            return res.status;
        }
        catch (error) {
            return res.status(500).json({ error: 'Error updating room' });
        }
    }
    static async joinRoom(req, res) {
        const { joinID } = req.params;
        const user = req.user?._id;
        const room = await chat_model_1.default.findOne({ join_id: joinID });
        if (!room)
            return res.status(404).json({ error: 'Room not found!' });
        console.log(room.participants);
        // ! TODO => Add user to room if not participant or host
    }
    static async deleteRoom(req, res) {
        const { roomID } = req.params;
        const user = req.user?._id;
        try {
            if (!(0, mongoose_1.isValidObjectId)(roomID))
                return res.status(422).json({ error: 'No such room!' });
            const room = await chat_model_1.default.exists({ _id: roomID });
            if (!room)
                return res.status(404).json({ error: 'Room not found' });
            await chat_model_1.default.findByIdAndDelete(roomID, { host: { $eq: user } });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Could not delete room!' });
        }
    }
    static async leaveRoom(req, res) {
        //!TODO => Impplement leave room logic.
        /*
        Room moderators can remove anyone from a room
        and participants can only remove themselves
        */
    }
    static async sendMessage(req, res) {
        const { roomID } = req.params;
        const { content } = req.body;
        const userID = req.user?._id;
        try {
            if (!content) {
                return res.status(422).json({ error: 'No message body' });
            }
            const mssg = await chat_model_1.Message.create({ author: userID, content });
            if (!mssg) {
                return res.status(400).json({ error: 'Error creating rooms' });
            }
            const room = await chat_model_1.default.findById(roomID);
            if (!room) {
                return res.status(404).json({ error: 'Room not found!' });
            }
            await chat_model_1.default.findByIdAndUpdate(roomID, { mesages: [...room.messages, mssg._id] }, { new: true });
            await mssg.save();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error sending message' });
        }
    }
    static async deleteMessage(req, res) {
        const userID = req.user?._id;
        // !TODO => Delete message and remove its ref from any room
    }
}
exports.default = ChatController;
