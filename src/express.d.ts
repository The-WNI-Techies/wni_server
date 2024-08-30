import * as express from "express";
import { Document } from "mongoose";


declare global {
    namespace Express {
        interface Request {
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
              vToken?: string | null | undefined;
            }
          >;
        }
    }
}