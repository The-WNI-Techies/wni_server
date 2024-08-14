import type { NextFunction, Request, Response } from "express";
export const  Logger = (req: Request, _res: Response, next: NextFunction) => {
    console.log(`URL ${req.url}`);
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    next();
}