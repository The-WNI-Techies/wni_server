import { model, Schema } from "mongoose";

function AnHourFromCurrentTime() {
    const now = new Date();
    now.setHours(now.getHours() + 1)
    const then = now;
    return then;
}

const ResetPasswordTokenSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Schema.Types.Date,
        default: AnHourFromCurrentTime(),
    }
});


export const ResetPasswordToken = model('ResetPasswordToken', ResetPasswordTokenSchema);