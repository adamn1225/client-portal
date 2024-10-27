import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { sendEmail } from '@/lib/emailService';

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') dotenv.config();

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const form = formidable({
            uploadDir: path.join(process.cwd(), 'uploads'),
            keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error parsing form' });
            }

            const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
            const first_name = Array.isArray(fields.first_name) ? fields.first_name[0] : fields.first_name;
            const last_name = Array.isArray(fields.last_name) ? fields.last_name[0] : fields.last_name;
            const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
            const phone_number = Array.isArray(fields.phone_number) ? fields.phone_number[0] : fields.phone_number;
            const screenshot = files.screenshot as formidable.File | formidable.File[];

            const emailText = `Message: ${message}\n\nFirst Name: ${first_name}\nLast Name: ${last_name}\nEmail: ${email}\nPhone Number: ${phone_number}`;

            let attachments: {
                filename: string | null;
                content: Buffer;
            }[] = [];

            if (screenshot) {
                const screenshotFile = Array.isArray(screenshot) ? screenshot[0] : screenshot;
                const screenshotData = await fs.readFile(screenshotFile.filepath);
                attachments.push({
                    filename: screenshotFile.originalFilename,
                    content: screenshotData,
                });
            }

            try {
                await sendEmail('adam@exacttransport.com', 'New Feedback Received', emailText, attachments);
                res.status(200).json({ message: 'Feedback sent successfully' });
            } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Error sending email' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default handler;