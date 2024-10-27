import sendgrid from "@sendgrid/mail";
import dotenv from 'dotenv';

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') dotenv.config();

const sendGridApiKey = process.env.SENDGRID_API_KEY;

if (!sendGridApiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}

sendgrid.setApiKey(sendGridApiKey);

export const sendEmail = async (to, subject, text) => {
    const msg = {
        to: 'nationwidetransportservices',
        from: 'nationwidetransportservices', // Replace with your verified sender
        subject: 'nationwidetransportservices',
        text: 'nationwidetransportservices',
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendEmailInvitation = async (to, subject, text) => {
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