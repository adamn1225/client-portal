import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CheckIcon from './icons/CheckIcon';
import Link from 'next/link';

const Hero = () => {
    return (
        <>
            <div className="flex items-start mt-12 justify-center gap-3 px-6 w-full sm:flex-row">
                <div className="flex flex-col items-start gap-5 pt-13 max-w-full">
                    <div className="max-w-full">
                        <h1 className="inline text-lg">Your trusted partner in </h1>
                        <h1 className="inline text-lg text-slate-900 font-semibold">Inventory Management, </h1>
                        <h1 className="inline text-lg text-slate-900 font-semibold">Procurement, </h1>
                        <h1 className="inline text-lg">and</h1>
                        <h1 className="inline text-lg text-slate-900 font-semibold">  Logistics.</h1>
                    </div>
                    <p className="text-slate-900 max-w-400px text-lg">
                        The easiest way to build React Landing page in seconds. Save time and focus on your project.
                    </p>

                    <h2 className='text-slate-900 font-medium text-lg'>Subscribe to stay up to date on added features!</h2>
                        <div className="flex gap-1 w-1/2">
                        <Input placeholder="Enter your email address" />
                        <Button className='dark-light-btn'> Subscribe</Button>
                    
                    </div>
                    <div className="flex flex-col flex-wrap gap-8 py-7 sm:py-4">
                        <div className="flex items-center text-gray-600">
                            <CheckIcon /> Members who joined during Beta will have a lifetime discount.
                        </div>
                        <div className="flex items-center text-gray-600">
                            <CheckIcon /> Direct Support - We would really, really appreciate your feedback.
                        </div>
                        <div className="flex items-center text-gray-600">
                            <CheckIcon /> Completely free during Beta.
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <img src="mock.png" className=" object-contain" alt="Mockup" />
                </div>
            </div>
            
        </>
    );
};

export default Hero;