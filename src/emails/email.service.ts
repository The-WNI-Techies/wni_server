import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { readFileSync } from "fs";

class EmailService{
    private static transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE as string,
        auth: {
            user: process.env.EMAIL_ADDRESS as string,
            pass: process.env.EMAIL_PASS as string
        }
    });
    
    private static parseMailFile(file: string, username: string, vToken: string) {
        return file.split(' ').map((token) => String(token)
                .replace('${username}', username)
                .replace('${vToken}', vToken)
                ).join(' ');
    }

    static async sendVerificationEmail(to: string, username: string, vToken: string) {
        const mailOptions: Mail.Options = {
            from: process.env.EMAIL_ADDRESS as string,
            to,
            subject: 'Email Verification',
            html: this.parseMailFile(readFileSync(`${__dirname}/verification_email.html`).toString(), 'Adeyemi', vToken)
        }

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Verification mail sent successfully');
        } catch (error) {
            throw error;
        }
        
    }
}




export default EmailService;
