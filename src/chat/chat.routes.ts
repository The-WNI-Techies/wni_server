import { Router } from "express";
import ChatController from "./chat.controller";

const chat = Router();

chat.get('/', ChatController.allRooms);
chat.get('/search', ChatController.searchRooms);
chat.post('/create', ChatController.createRoom);
chat.delete('/:roomID', ChatController.deleteRoom);

export default chat;