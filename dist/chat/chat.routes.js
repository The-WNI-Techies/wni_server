"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = __importDefault(require("./chat.controller"));
const chat = (0, express_1.Router)();
chat.get('/', chat_controller_1.default.allRooms);
chat.get('/search', chat_controller_1.default.searchRooms);
chat.post('/create', chat_controller_1.default.createRoom);
// chat.post(':joinID/join', ChatController.joinRoom);
// chat.post(':roomID/leave', ChatController.leaveRoom);
chat.delete(':roomID', chat_controller_1.default.deleteRoom);
chat.post(':roomID/send', chat_controller_1.default.sendMessage);
// chat.delete('/:roomID/:messageID', ChatController.deleteMessage);
exports.default = chat;
