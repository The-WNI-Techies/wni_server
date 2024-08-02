"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordToken = void 0;
const mongoose_1 = require("mongoose");
function AnHourFromCurrentTime() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const then = now;
    return then;
}
const ResetPasswordTokenSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: mongoose_1.Schema.Types.Date,
        default: AnHourFromCurrentTime(),
    }
});
exports.ResetPasswordToken = (0, mongoose_1.model)('ResetPasswordToken', ResetPasswordTokenSchema);
