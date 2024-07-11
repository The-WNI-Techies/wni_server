import IAppRequest from "../interfaces/IAppRequest";
import { Response } from "express";
import ChatRoom from "./chat.model";
import IChatRoom from "../interfaces/IChatRoom";
import { isValidObjectId, Types } from "mongoose";

class ChatController {

    static async createRoom(req: IAppRequest, res: Response) {
        const { name, description } = req.body;
        const id = req.user?._id as Types.ObjectId;

        try {
            if(!name) {
                return res.status(422).json({ error: 'Name required!'})
            }
            const roomData: Partial<IChatRoom> = { name, creator: id  };
            if(description) roomData.description = description;

            const room = await ChatRoom.create(roomData);
            room.save();
        } catch (error) {
            return res.status(500).json({ error: 'Error creating room, try again' })
        }
    }

    static async allRooms(req: IAppRequest, res: Response) {
        const { page, limit } = req.query;
        try {
            const currentPage = parseInt(page as string) || 1;
            const limitInt = parseInt(limit as string) || 20;
            const pages = await ChatRoom.countDocuments();

            if(currentPage > pages) {
                return res.status(404).json({ error: 'Page does not exist' });
            }

            const rooms = await ChatRoom.find().skip(currentPage - 1).limit(limitInt);
            if(!rooms) {
                return res.status(404).json({ error: 'No rooms found!'});
            }
            
            return res.status(200).json({ success: 'Rooms found!', pages_left: pages - currentPage })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async searchRooms(req: IAppRequest, res: Response) {
        const { name } = req.query;
        try {
            if(!name || !name.toString().trim()) {
                return res.status(422).json({ error: 'No search argument provided!' })
            }

            const roomQuery = new RegExp(`${name?.toString().trim()}`, 'i');
            const matched = await ChatRoom.find({ name: roomQuery });
            if(!matched) {
                return res.status(404).json({ error: 'No room found!' });
            }
            return res.status(200).json({ success: 'Match(es) found!', matches: matched })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error!' });
        }
    }

    static async myRooms(req: IAppRequest, res: Response) {}

    static async editRoom(req: IAppRequest, res: Response) {}
    
    static async joinRoom(req: IAppRequest, res: Response) {
        const { roomID } = req.params;
        const user = req.user?._id;
        if(!isValidObjectId(roomID)) {
            return res.status(422).json({ error: 'No such room!' });
        }

        const room = await ChatRoom.findById(roomID);
        if(!room) return res.status(404).json({ error: 'Room not found!' });

        console.log(room.participants);
        // ! TODO => Add user to room if not participant or host
    }

    static async deleteRoom(req: IAppRequest, res: Response) {
        const { roomID } = req.params;
        const user = req.user?._id;

        try {
            if(!isValidObjectId(roomID)) return res.status(422).json({ error: 'No such room!' });

            const room = await ChatRoom.exists({ _id: roomID });
            if(!room) return res.status(404).json({ error: 'Room not found' });

            await ChatRoom.findByIdAndDelete(roomID, {host: {$eq: user}}); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Could not delete room!' })
        }
        
    }

    static async leaveRoom(req: IAppRequest, res: Response) {
        /* 
        Room moderators can remove anyone from a room 
        and participants can only remove themselves
        */
    }

    static async sendMessage(req: IAppRequest, res: Response) {}

    static async deleteMessage(req: IAppRequest, res: Response) {}
}

export default ChatController;

