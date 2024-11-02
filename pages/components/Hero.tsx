import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CheckIcon from './icons/CheckIcon';
import Link from 'next/link';

const Hero = () => {
    return (
        <>
            <div className="flex md:flex-row flex-col w-full items-center mt-2  justify-center md:gap-3 md:items-start  md:mt-12">
                <div className="flex flex-col items-center md:items-start md:gap-5 pt-13">
                    <div className="w-full flex md:flex-row flex-col justify-center items-center">
                        <h1 className="inline text-lg">Your trusted partner in </h1>
                        <h1 className="inline text-lg font-semibold">Inventory Management, </h1>
                        <h1 className="inline text-lg  font-semibold">Procurement, </h1>
                        <h1 className="inline text-lg">and</h1>
                        <h1 className="inline text-lg  font-semibold">  Logistics.</h1>
                    </div>
                    <p className="max-w-400px text-lg">
                        The easiest way to build React Landing page in seconds. Save time and focus on your project.
                    </p>
                    <div className="md:hidden w-full">
                    <img src="mock.png" className=" object-contain" alt="Mockup" />
                   </div>
                    <h2 className='font-medium text-lg'>Subscribe to stay up to date on added features!</h2>
                        <div className="flex flex-col w-full gap-1 md:w-1/2">
                        <Input placeholder="Enter your email address" />
                        <Button className='dark-light-btn'> Subscribe</Button>
                    
                    </div>
                    <div className="flex flex-col flex-wrap gap-8 py-7 sm:py-4">
                        <div className="flex items-center">
                            <CheckIcon /> Members who joined during Beta will have a lifetime discount.
                        </div>
                        <div className="flex items-center">
                            <CheckIcon /> Direct Support - We would really, really appreciate your feedback.
                        </div>
                        <div className="flex items-center">
                            <CheckIcon /> Completely free during Beta.
                        </div>
                    </div>
                </div>
                <div className="hidden md:block w-1/3">
                    <img src="mock.png" className=" object-contain" alt="Mockup" />
                </div>
            </div>
            
        </>
    );
};

export default Hero;