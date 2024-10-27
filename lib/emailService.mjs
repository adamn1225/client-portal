import sendgrid from '@sendgrid/mail';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') dotenv.config();


const sendGridApiKey = process.env.SENDGRID_API_KEY;

sendgrid.setApiKey(sendGridApiKey);

export const sendEmail = async (to, subject, text) => {
    if (typeof window !== 'undefined') {
        throw new Error('sendEmail should only be called on the server');
    }

    const msg = {
        to: 'noah@nationwidetransportservices.com', // Replace with your email
        from: 'noah@nationwidetransportservices.com', // Replace with your verified sender
        subject: 'test',
        text: 'test',
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendEmailInvitation = async (to, subject, text) => {
    if (typeof window !== 'undefined') {
        throw new Error('sendEmailInvitation should only be called on the server');
    }

    const msg = {
        to,
        from: 'your-email@example.com', // Replace with your verified sender
        subject,
        text,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};