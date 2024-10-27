import {NextApiRequest, NextApiResponse} from 'next';
import sgMail from '@sendgrid/mail';

const sendGridApiKey = process.env.SENDGRID_API_KEY;

if (!sendGridApiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(sendGridApiKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;

        const msg = {
            to,
            from: 'noah@ntslogistics.com', // Use your verified SendGrid sender email
            subject,
            text,
        };

        try {
            await sgMail.send(msg);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}