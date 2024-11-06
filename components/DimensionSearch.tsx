"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from 'lucide-react';

interface Dimensions {
    Length: string;
    Width: string | string[];
    Height: string;
}

interface Excavator {
    "Manufacturer/Model": string;
    Weight: string;
    dimensions: Dimensions;
}

const DimensionSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Excavator[]>([]);
    const [data, setData] = useState<Excavator[]>([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const manufacturers = [
        "Caterpillar",
        "John Deere",
        "Case",
        "Komatsu",
        "Terex",
        "Ford",
        "Volvo",
        "Hitachi",
        "JCB",
        "Kubota",
        "New Holland",
        "Bobcat",
        "Yanmar",
        "Doosan",
        "Kobelco",
        "Hyundai",
        "Takeuchi",
        "Kawasaki",
        "Liebherr",
        "Sany",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/search');
                console.log('Fetched data:', response.data); // Debugging: Log fetched data
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        const filteredData = selectedManufacturer
            ? data.filter(item => item["Manufacturer/Model"].toLowerCase().includes(selectedManufacturer.toLowerCase()))
            : data;

        console.log('Filtered data:', filteredData); // Debugging: Log filtered data

        const fuse = new Fuse(filteredData, {
            keys: ['Manufacturer/Model'],
            threshold: 0.3, // Adjust the threshold for more or less fuzzy matching
        });
        const result = fuse.search(query);
        console.log('Search results:', result); // Debugging: Log search results
        setResults(result.map(r => r.item));
    };

    const handleClearSearch = () => {
        setQuery('');
        setResults([]);
        setSelectedManufacturer('');
        setInputValue('');
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Equipment Dimension Search/Directory</h1>
            <h2 className="text-lg font-bold text-center w-1/2 mb-4">More comprehensive data (wheelbase, track lengths, illustrations/images (not as soon), etc.) coming soon. As always - just as if you're looking up dimensions from another during a google search, it is always better to ask the client for dimensions/images.</h2>
            <div className='flex gap-4 w-full justify-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="relative mb-4 w-1/4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-950" />
                            <Input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Select Manufacturer"
                                className="pl-10"
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>Select Manufacturer</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {manufacturers.filter(manufacturer =>
                            manufacturer.toLowerCase().includes(inputValue.toLowerCase())
                        ).map((manufacturer, index) => (
                            <DropdownMenuItem key={index} onSelect={() => {
                                setSelectedManufacturer(manufacturer);
                                setInputValue(manufacturer);
                            }}>
                                {manufacturer}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className='w-1/4'>

                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search dimensions..."
                        className="mb-4"
                    />

                </div>
            </div>
            <div className="flex gap-4 mb-4 justify-center">
                <Button onClick={handleSearch}>Search</Button>
                <Button onClick={handleClearSearch} variant="outline">Clear</Button>
            </div>
            <ul className="flex flex-col justify-center items-center gap-4 w-full">
                {results.map((result, index) => (
                    <div key={index} className='flex flex-col gap-4 w-2/3 justify-evenly items-center bg-stone-50 border border-gray-800 p-4 h-auto'>
                        <div className='grid grid-cols-1 justify-items-start'>
                            <li className="font-bold cursor-pointer  border-b border-gray-500" onClick={() => toggleExpand(index)}>
                                {result["Manufacturer/Model"]}
                            </li>
                        </div>
                        {expandedIndex === index && (
                            <div className="flex flex-col gap-1 ">
                                <li className="font-bold border-b border-gray-400">Weight: {result.Weight}</li>
                                <ul>
                                    <li className='border-b border-gray-400'>Length: {result.dimensions.Length}</li>
                                    <li className='border-b border-gray-400'>Width: {Array.isArray(result.dimensions.Width) ? result.dimensions.Width.join(', ') : result.dimensions.Width}</li>
                                    <li className='border-b border-gray-400'>Height: {result.dimensions.Height}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default DimensionSearch;