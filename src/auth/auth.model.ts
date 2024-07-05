import { model, Schema } from "mongoose";

const ResetPasswordTokenSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    token: {
        type: Schema.Types.UUID,
        required: true
    },
    expires: {
        type: Schema.Types.Date,
        // default: new Date() 
    }
});


export const ResetPasswordToken = model('ResetPasswordToken', ResetPasswordTokenSchema);