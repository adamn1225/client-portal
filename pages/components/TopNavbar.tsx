import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import DarkModeToggle from '@/components/DarkModeToggle';
import Link from 'next/link';
import { Move3d } from 'lucide-react';
import ContactUs from './ContactUs';

interface TopNavbarProps {
    className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className }) => {
    return (
        <header className="bg-zinc-900 dark:bg-zinc-950 text-white p-4">
            <div className="md:container w-full mx-auto flex flex-col xs:justify-center md:flex-row md:justify-between items-center gap-4">
                <span className="sm:text-base flex flex-row xs:justify-between md:justify-start  items-center text-zinc-900 font-bold w-full md:text-3xl md:gap-6 dark:text-zinc-100">
                    <span className='flex items-center justify-center font-bold  flex-nowrap'><Move3d className='size-10 text-red-800' /> 
                     <Link href="/"><h1 className='tracking-tighter text-stone-100 text-nowrap font-serif md:leading-10'>HEAVY CONSTRUCT</h1></Link>
                     </span>
                   <span className="w-full flex justify-center md:hidden"> <DarkModeToggle className='md:hidden' /></span>
                </span>
                <nav className="w-full flex gap-2 justify-center md:justify-end items-center m-0">
                    <DarkModeToggle className="hidden md:flex" />
                    <Link href="/login" className="md:ml-4 dark-light-btn">Sign In</Link>
                    <Link href="/signup" className="hidden md:block ml-4 dark-light-btn">Sign Up</Link>
                    <Link href="/contact" className="object-center md:ml-12 m-0 dark-light-btn">Contact Us</Link>
                </nav>
            </div>
        </header>
    );
};

export default TopNavbar;