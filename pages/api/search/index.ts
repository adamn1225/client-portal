import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

interface Dimensions {
    Length: string;
    Width: string | string[];
    Height: string;
}

interface Excavator {
    "Manufacturer/Model": string;
    Weight: string;
    dimensions: Dimensions;
    [key: string]: any; // Allow for additional properties
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const jsonFilePath = path.join(process.cwd(), 'public', 'vera-equipment-data.json');
            const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
            const data: { "vera-equipment-data": Excavator[] } = JSON.parse(jsonData);

            console.log('Data read from JSON file:', data); // Debugging: Log data read from JSON file

            res.status(200).json(data["vera-equipment-data"]);
        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}