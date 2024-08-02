"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = require("fs");
class EmailService {
    static parseMailFile(file, username, code) {
        return file.split(' ').map((token) => String(token)
            .replace('${username}', username)
            .replace('${vToken}', code)
            .replace('${passwordResetToken}', code)).join(' ');
    }
    static async sendVerificationEmail(to, username, vToken) {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to,
            subject: 'Email Verification',
            html: this.parseMailFile((0, fs_1.readFileSync)(`${__dirname}/templates/verification_email.html`).toString(), username, vToken)
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Verification mail sent successfully');
        }
        catch (error) {
            throw error;
        }
    }
    static async sendPasswordResetToken(to, username, resetPasswordToken) {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to,
            subject: 'Reset Password',
            html: this.parseMailFile((0, fs_1.readFileSync)(`${__dirname}/templates/password_reset.html`).toString(), username, resetPasswordToken)
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Reset Password mail sent successfully');
        }
        catch (error) {
            throw error;
        }
    }
}
EmailService.transporter = nodemailer_1.default.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS
    }
});
exports.default = EmailService;
