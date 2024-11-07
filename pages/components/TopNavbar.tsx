import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import DarkModeToggle from '@/components/DarkModeToggle';
import Link from 'next/link';
import { Move3d } from 'lucide-react';

interface TopNavbarProps {
    className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className }) => {
    return (
        <header className="bg-slate-200 dark:bg-gray-900 text-white p-4">
            <div className="container w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-3xl  text-slate-900 font-bold flex w-full md:justify-start justify-between gap-6 items-center dark:text-slate-100">
                    <h1 className='flex gap-2 items-center'><Move3d /> Heavy Construct</h1>
                    <DarkModeToggle className='md:hidden' />
                </span>
                <nav className="w-full flex justify-center md:justify-end items-center m-0">
                    <DarkModeToggle className="hidden md:flex" />
                    <Link href="/login" className="md:ml-4 dark-light-btn">Sign In</Link>
                    <Link href="/signup" className="ml-4 dark-light-btn">Sign Up</Link>
                </nav>
            </div>
        </header>
    );
};

export default TopNavbar;