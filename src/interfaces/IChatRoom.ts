import { Types } from "mongoose";

interface IChatRoom {
    creator: Types.ObjectId;
    name: string;
    description?: string;
    messages?: Array<Types.ObjectId>;
    mode?: string;
    participants: Types.DocumentArray<{
        user?: Types.ObjectId | null | undefined;
        role?: "regular" | "moderator" | null | undefined;
    }>  
}

export default IChatRoom;