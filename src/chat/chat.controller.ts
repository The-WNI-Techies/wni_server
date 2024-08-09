import IAppRequest from "../interfaces/IAppRequest";
import { Response } from "express";
import ChatRoom, { Message } from "./chat.model";
import IChatRoom from "../interfaces/IChatRoom";
import { isValidObjectId, Types } from "mongoose";
import roomValidationSchema from "../validation/roomValidation";
import shortUUID from "short-uuid";

class ChatController {

    static async createRoom(req: IAppRequest, res: Response) {
        const { name, description } = req.body;
        const id = req.user?._id as Types.ObjectId;

        try {
            const roomData: Partial<IChatRoom> = { name, creator: id, join_id: shortUUID.uuid() };
            if (description) roomData.description = description;

            const { error } = roomValidationSchema.validate(roomData);
            if (error) {
                return res.status(422).json({ error: error.details[0].message });
            }
            await ChatRoom.create(roomData);
            return res.status(201).json({ success: 'Room created successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error creating room, try again' })
        }
    }

    static async allRooms(req: IAppRequest, res: Response) {
        const { page, limit } = req.query;
        try {
            const currentPage = parseInt(page as string) || 1;
            const limitInt = parseInt(limit as string) || 20;
            const pages = await ChatRoom.countDocuments();

            if (currentPage > pages) {
                return res.status(404).json({ error: 'Page does not exist' });
            }

            const rooms = await ChatRoom.find().skip(currentPage - 1).limit(limitInt);
            if (!rooms) {
                return res.status(404).json({ error: 'No rooms found!' });
            }

            return res.status(200).json({ success: 'Rooms found!', pages_left: pages - currentPage, rooms })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async searchRooms(req: IAppRequest, res: Response) {
        const { name } = req.query;
        try {
            if (!name || !name.toString().trim()) {
                return res.status(422).json({ error: 'No search argument provided!' })
            }

            const roomQuery = new RegExp(`${name?.toString().trim()}`, 'i');
            const matched = await ChatRoom.find({ name: roomQuery });
            if (!matched) {
                return res.status(404).json({ error: 'No room found!' });
            }
            return res.status(200).json({ success: 'Match(es) found!', matches: matched })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async editRoom(req: IAppRequest, res: Response) {
        const { name, description, mode, join_id } = req.body;
        const roomID = req.params;

        try {
            let roomData: Partial<IChatRoom> = {};
            if (name) roomData.name = name;
            if (description) roomData.description = description;
            if (mode) roomData.mode = mode;
            if (join_id) roomData.join_id = join_id;

            const { error } = roomValidationSchema.validate(roomData);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            await ChatRoom.findByIdAndUpdate(roomID, roomData, { new: true });
            return res.status(200).json({ success: "Room update succcessful!", room: roomData })
        } catch (error) {
            return res.status(500).json({ error: 'Error updating room' });
        }

    }

    static async joinRoom(req: IAppRequest, res: Response) {
        const { joinID } = req.params;
        const user = req.user?._id as any as Types.ObjectId;

        try {
            const room = await ChatRoom.findOne({ join_id: joinID });
            if (!room) return res.status(404).json({ error: 'Room not found!' });

            console.log(room.participants);
            console.log(`\n\n\n${user}`);

            const isHost = room.creator === user;
            const isRoomParticipant = room.participants.find(participant => participant.user?.toString() === user.toString());

            if (isHost || isRoomParticipant) {
                return res.status(400).json({ error: "Already a room participant!" })
            }
            const newParticipant = {
                user,
                role: 'regular'
            }
            room.participants.push(newParticipant);
            await room.save();
            return res.status(200).json({ success: "Joined room successfully!" })
        } catch (error) {

        }
    }

    static async deleteRoom(req: IAppRequest, res: Response) {
        const { roomID } = req.params;
        const user = req.user?._id as any as Types.ObjectId;
        try {
            if(!isValidObjectId(roomID)) return res.status(422).json({ error: 'No such room!' });

            const room = await ChatRoom.exists({ _id: roomID });
            if(!room) return res.status(404).json({ error: 'Room not found' });

            const deletedRoom = await ChatRoom.findByIdAndDelete(roomID, {host: {$eq: user}});
            if(!deletedRoom) {
                return res.status(400).json({ error: "Error deleting chat room!" })
            }
            return res.status(200).json({ success: "Room deleted successfully!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error deleting that room" });
        }
    }

    static async leaveRoom(req: IAppRequest, res: Response) {
        //!TODO => Impplement leave room logic.
        /* 
        Room moderators can remove anyone from a room 
        and participants can only remove themselves
        */
    }

    static async sendMessage(req: IAppRequest, res: Response) {
        const { roomID } = req.params;
        const { content } = req.body;
        const userID = req.user?._id;

        try {
            if (!content) {
                return res.status(422).json({ error: 'No message body' });
            }

            const mssg = await Message.create({ author: userID, content });
            if (!mssg) {
                return res.status(400).json({ error: 'Error creating rooms' })
            }

            const room = await ChatRoom.findById(roomID);
            if (!room) {
                return res.status(404).json({ error: 'Room not found!' });
            }
            await ChatRoom.findByIdAndUpdate(roomID,
                { mesages: [...room.messages, mssg._id] },
                { new: true }
            );
            await mssg.save();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error sending message' });
        }
    }

    static async deleteMessage(req: IAppRequest, res: Response) {
        const userID = req.user?._id;

        // !TODO => Delete message and remove its ref from any room
    }
}

export default ChatController;

