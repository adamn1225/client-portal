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

interface EquipmentSpecs {
    [key: string]: any; // Allow for additional properties
}

interface CombinedData {
    model: string;
    data: EquipmentSpecs; // Adjust as needed
}

const CaterpillarSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CombinedData[]>([]);
    const [data, setData] = useState<CombinedData[]>([]);
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
                const response = await axios.get('/api/caterpillar-equipment-specs');
                console.log('Fetched data:', response.data); // Debugging: Log fetched data

                // Ensure the response data is an array
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        const filteredData = selectedManufacturer
            ? data.filter(item => item.model && item.model.toLowerCase().includes(selectedManufacturer.toLowerCase()))
            : data;

        console.log('Filtered data:', filteredData); // Debugging: Log filtered data

        // Create a list of keys to search through, including all keys in the data
        const keys = ['model', ...Object.keys(filteredData[0]?.data || {}).map(key => `data.${key}`)];

        const fuse = new Fuse(filteredData, {
            keys,
            threshold: 0.3, // Adjust the threshold for more or less fuzzy matching
            includeScore: true,
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
        <div className="p-4 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-1 text-center">Caterpillar Equipment Search</h1>
            <h2 className="text-lg font-bold text-center w-1/2">Component will currently only pull full specifications for caterpillar
                - I left this here as a visual as I work ok organize the data gathered to display properly - but the data from cat is accurate.
            </h2>
            <div className='flex gap-4 mt-6'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="relative mb-4 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-950" />
                            <Input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Select Manufacturer"
                                className="pl-10 bg-muted-200"
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
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search specifications..."
                    className="mb-4"
                />
            </div>
            <div className="flex gap-4 mb-4 justify-center">
                <Button className='dark-button hover:bg-gray-800' onClick={handleSearch}>Search</Button>
                <Button className='dark-button' onClick={handleClearSearch} variant="outline">Clear</Button>
            </div>
            <ul className="flex flex-col justify-center items-center gap-4 w-full">
                {results.map((result, index) => (
                    <div key={index} className='flex flex-col gap-4 w-2/3 justify-evenly items-center bg-stone-50 border border-gray-800 p-4 h-auto'>
                        <div className='grid grid-cols-1 justify-items-start'>
                            <li className="font-bold cursor-pointer" onClick={() => toggleExpand(index)}>
                                {result.model}
                            </li>
                        </div>
                        {expandedIndex === index && (
                            <div className="flex flex-col gap-1">
                                {Object.entries(result.data).map(([key, value], idx, arr) => (
                                    <div key={key} className={`pb-2 ${idx !== arr.length - 1 ? 'border-b border-gray-500' : ''}`}>
                                        <strong>{key}:</strong> {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default CaterpillarSearch;