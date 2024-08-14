import { model, Schema } from "mongoose";

function anHourFromNow() {
	const now = new Date();
	return now.setHours(now.getHours() + 1)
}

const ResetPasswordTokenSchema = new Schema({
	user: {
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
		default: anHourFromNow(),
	}
});


export const ResetPasswordToken = model('ResetPasswordToken', ResetPasswordTokenSchema);