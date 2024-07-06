import { NextFunction, Response } from "express";
import IAppRequest from "../interfaces/IAppRequest";

class AuthMiddleware {

    static async requireAuth(req: IAppRequest, res: Response, next: NextFunction) { next() }

    static async requireVerification(req: IAppRequest, res: Response, next: NextFunction ) { next() }

    static async canResetPassword(req: IAppRequest, res: Response, next: NextFunction) { next();}

}

export default AuthMiddleware;