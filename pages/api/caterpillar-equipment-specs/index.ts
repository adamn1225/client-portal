import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
    try {
        const jsonFilePath = path.join(process.cwd(), 'public', 'caterpillar-equipment-specs.json');
        const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
        const data: { [key: string]: any } = JSON.parse(jsonData);

        // Filter out dimensions-related properties
        const filteredData = Object.entries(data).map(([model, specs]) => {
            const { Length, Width, Height, ...filteredSpecs } = specs;
            return {
                model,
                data: filteredSpecs
            };
        });

        return NextResponse.json(filteredData);
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}