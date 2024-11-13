import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CheckIcon from './icons/CheckIcon';
import { useDarkMode } from '@/context/DarkModeContext';
import { addSubscriber } from '@/lib/database';

const Hero = () => {
    const { darkMode } = useDarkMode();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubscribe = async () => {
        if (!email) {
            setMessage('Please enter a valid email address.');
            return;
        }

        const { data, error } = await addSubscriber(email);

        if (error) {
            setMessage('Error subscribing. Please try again.');
            console.error('Error subscribing:', error);
        } else {
            setMessage('Thank you for subscribing! You will now receive the latest updates and news directly to your inbox.');
            setEmail(''); // Clear the input field
        }
    };

    return (
        <>
            <div className="flex md:flex-row flex-col w-full items-center mt-2 justify-center md:gap-3 md:items-start md:mt-12">
                <div className="flex flex-col items-center md:items-start md:gap-5 pt-13">
                    <div className="w-full flex md:flex-row flex-col justify-center items-center">
                        <h1 className="inline text-lg">Your trusted partner in </h1>
                        <h1 className="inline text-lg font-semibold">Inventory Management, </h1>
                        <h1 className="inline text-lg font-semibold">Procurement, </h1>
                        <h1 className="inline text-lg">and</h1>
                        <h1 className="inline text-lg font-semibold"> Logistics.</h1>
                    </div>
                    <p className="max-w-400px text-lg mb-5">
                        The easiest way to build React Landing page in seconds. Save time and focus on your project.
                    </p>
                    <div className="md:hidden w-full">
                        <img src={darkMode ? "dark-app-display.png" : "light-app-display.png"} className="object-contain" alt="Mockup" />
                    </div>
                    <h2 className='font-medium text-lg'>Subscribe to stay up to date on added features!</h2>
                    <div className="flex flex-col w-full gap-1 md:w-1/2">
                        <Input
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className='dark-light-btn' onClick={handleSubscribe}> Subscribe</button>
                        {message && <p className="mt-2 text-green-600">{message}</p>}
                    </div>
                    <div className="flex flex-col sm:py-4 md:flex-wrap md:gap-8 md:py-7">
  <div className="flex md:items-center">
    <CheckIcon /> Members who joined during Beta will have a lifetime discount.
  </div>
  <div className="flex md:items-center">
    <CheckIcon /> Direct Support (We would really, really appreciate your feedback.)
  </div>
  <div className="flex md:items-center">
    <CheckIcon /> Completely free during Beta.
  </div>
</div>
                </div>
                <div className="hidden md:block w-1/3">
                    <img src={darkMode ? "dark-app-display.png" : "light-app-display.png"} className="object-contain" alt="Mockup" />
                </div>
            </div>
        </>
    );
};

export default Hero;