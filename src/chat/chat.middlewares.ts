import type { NextFunction, Response } from "express";
import IAppRequest from "../interfaces/IAppRequest";
import ChatRoom from "./chat.model";

class ChatMiddleWare {
    static async isParticipant(req: IAppRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user?._id;
            const { roomID } = req.params;
            const chatRoom = await ChatRoom.findById(roomID);
            if (!chatRoom) {
                return res.status(404).json({ error: "Room not found! " });
            }
            const isMember = chatRoom.participants.find(participant => participant.user === user) || chatRoom.creator === user;
            if (!isMember) {
                return res.status(403).json({ error: "Not a room participant" });
            }
            next();
        } catch (error) {
            return res.status(500).json({ error: "Internal server error!" });
        }

    }
    static async isHost(req: IAppRequest, res: Response, next: NextFunction) {
        try {
            const { roomID } = req.params;
            const user = req.user?._id;
            const chatRoom = await ChatRoom.findById(roomID);
            if (!chatRoom) {
                return res.status(404).json({ error: "Can not find that room" });
            }

            const isHost = chatRoom.creator === user;
            if (!isHost) {
                return res.status(403).json({ error: "Can not perform that action!" })
            }
            next()
        } catch (error) {
            return res.status(500).json({ error: "Internal server error!" });
        }
    }
}