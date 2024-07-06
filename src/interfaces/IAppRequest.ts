import { Request } from "express";
import User from "../user/user.model";
import { Document } from "mongoose";

// const sampleUser = User.find();

interface IAppRequest extends Request {
  user?: Document<
    unknown,
    {},
    {
      createdAt: NativeDate;
      updatedAt: NativeDate;
    } & {
      username: string;
      role: "user" | "super_user" | "admin";
      email: string;
      password: string;
      verified: boolean;
      firstName?: string | null | undefined;
      lastName?: string | null | undefined;
      age?: number | null | undefined;
      gender?: "F" | "M" | null | undefined;
      short_id?: string | null | undefined;
      vTojken?: string | null | undefined;
    }
  >;
}

export default IAppRequest;
