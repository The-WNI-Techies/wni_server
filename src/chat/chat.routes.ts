import { Router } from "express";
import ChatController from "./chat.controller";

const chat = Router();

chat.get('/', ChatController.allRooms);
chat.get('/search', ChatController.searchRooms);
chat.post('/create', ChatController.createRoom);
// chat.post(':joinID/join', ChatController.joinRoom);
// chat.post(':roomID/leave', ChatController.leaveRoom);
chat.delete('/:roomID', ChatController.deleteRoom);
chat.post('/:roomID/send', ChatController.sendMessage);
// chat.delete('/:roomID/:messageID', ChatController.deleteMessage);

export default chat;