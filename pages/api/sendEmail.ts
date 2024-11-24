import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/lib/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { to, subject, text, attachments } = req.body;

        try {
            await sendEmail(to, subject, text, attachments);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}