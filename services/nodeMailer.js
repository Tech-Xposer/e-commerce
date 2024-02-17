const nodemailer = require('nodemailer')

const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    secureConnection: false,
    auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.APP_PASSWORD
    }
});

const nodeMailer = async (userMail, subject, text, content) => {
    try {

        const info = await transporter.sendMail({
            from: process.env.ADMIN_MAIL,
            to: userMail,
            subject: subject,
            text: text,
            html: content
        });
        return info;
    } catch (error) {
        console.log(`Error While sending verification email: ${error}`);
    }
}

module.exports = { nodeMailer }