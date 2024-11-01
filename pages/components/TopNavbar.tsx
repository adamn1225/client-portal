// components/TopNavbar.tsx
import react, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import FeedBack from '@/components/FeedBack';
import Link from 'next/link';
import { Move3d, Moon, Sun } from 'lucide-react';

interface TopNavbarProps {
    className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };

    return (
        <header className="bg-slate-200 dark:bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl  text-slate-900 font-bold flex gap-2 items-center dark:text-slate-100"><Move3d /> SSTA Inc</h1>
                <nav className="flex justify-end items-end m-0">
                
                    <button onClick={toggleDarkMode} className="p-2 rounded-full mr-2">
                        {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="dark:text-slate-100 text-gray-900" />}
                    </button>
                    <Link href="/login" className="ml-4 px-4 py-2 border border-gray-900 bg-gray-900 text-gray-100 font-medium hover:bg-gray-900 hover:border hover:border-amber-300 hover:text-amber-300">Sign In</Link>
                    <Link href="/user/signup" className="ml-4 px-4 py-2 border border-gray-900 bg-gray-900 text-gray-100 font-medium hover:bg-gray-900 hover:border hover:border-amber-300 hover:text-amber-300">Sign Up</Link>
                </nav>
            </div>
        </header>
    );
};

export default TopNavbar;