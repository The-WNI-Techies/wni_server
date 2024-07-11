import { Router } from "express";
import ChatController from "./chat.controller";

const chat = Router();

chat.post('/create', ChatController.createRoom);

export default chat;