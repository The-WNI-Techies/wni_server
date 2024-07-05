import { Request } from "express";

interface IAppRequest extends Request{
    user?: any;
}


export default IAppRequest;