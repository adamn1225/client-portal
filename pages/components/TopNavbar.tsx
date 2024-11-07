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
        <header className="bg-slate-200 dark:bg-gray-900 text-white p-4">
            <div className="container w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-3xl  text-slate-900 font-bold flex w-full md:justify-start justify-between gap-6 items-center dark:text-slate-100">
                    <span className='flex items-center justify-center font-bold  flex-nowrap'><Move3d className='size-8' />  <h1 className='tracking-tighter font-serif leading-10'>HEAVY CONSTRUCT</h1></span>
                    <DarkModeToggle className='md:hidden' />
                </span>
                <nav className="w-full flex justify-center md:justify-end items-center m-0">
                    <DarkModeToggle className="hidden md:flex" />
                    <Link href="/login" className="md:ml-4 dark-light-btn">Sign In</Link>
                    <Link href="/signup" className="ml-4 dark-light-btn">Sign Up</Link>
                </nav>
                <Link href="/contact" className="ml-12 m-0 contact-btn">Contact Us</Link>
            </div>
        </header>
    );
};

export default TopNavbar;