import { NextFunction, Request, Response } from "express";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies;
    console.log(authToken);;
    next()
}

export { requireAuth };