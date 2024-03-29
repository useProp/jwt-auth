import nodemailer from 'nodemailer';

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendActivationEmail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Email activation for ${process.env.API_URL}`,
            text: '',
            html:
            `
                <div>
                    <h1>Activation Link</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        }, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
}

export default new MailService();
