import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import sendgrid from '@sendgrid/mail';
import formidable from 'formidable';

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') dotenv.config();

const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}
sendgrid.setApiKey(sendGridApiKey);

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm({
            uploadDir: path.join(process.cwd(), 'uploads'),
            keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error parsing form' });
            }

            const { message, first_name, last_name, email, phone_number } = fields;
            const screenshot = files.screenshot;

            const msg = {
                to: 'noah@nationwidetransportservices.com', // Replace with your email
                from: 'noah@nationwidetransportservices.com', // Use your verified SendGrid sender email
                subject: 'New Feedback Received',
                text: `Message: ${message}\n\nFirst Name: ${first_name}\nLast Name: ${last_name}\nEmail: ${email}\nPhone Number: ${phone_number}`,
                attachments: [],
            };

            if (screenshot) {
                const screenshotData = await fs.readFile(screenshot.filepath);
                msg.attachments.push({
                    content: screenshotData.toString('base64'),
                    filename: screenshot.originalFilename || 'screenshot.png',
                    type: screenshot.mimetype || 'image/png',
                    disposition: 'attachment',
                });
            }

            try {
                await sendgrid.send(msg);
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