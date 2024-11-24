import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: process.env.SENDGRID_USER, // Your SendGrid username
        pass: process.env.SENDGRID_PASS, // Your SendGrid password
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
        throw error;
    }
};