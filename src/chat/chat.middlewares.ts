import type { NextFunction, Request, Response } from "express";

class ChatMiddleWare {
    static async isMember(req: Request, res: Response, next: NextFunction) {
        next()
    }
    static async isHost(req: Request, res: Response, next: NextFunction) {
        next()
    } 
}