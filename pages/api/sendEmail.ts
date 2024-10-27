import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your app-specific password
    },
});

export const sendEmail = async (to: string, subject: string, text: string, attachments: any[] = []) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Your email address
        to,
        subject,
        text,
        attachments,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};