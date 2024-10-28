import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import NotificationBell from '@/components/NotificationBell';
import { Moon, Sun } from 'lucide-react';

interface UserTopNavProps {
    session: any;
    className?: string;
}

const UserTopNav: React.FC<UserTopNavProps> = ({ session, className = '' }) => {
    const supabase = useSupabaseClient<Database>();
    const { userProfile } = useUser();
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

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
                alert('Failed to log out. Please try again.');
            }
            window.location.href = '/login'; // Redirect to login page
        } catch (err) {
            console.error('Unexpected error during logout:', err);
            alert('An unexpected error occurred. Please try again.');
            window.location.href = '/login'; // Redirect to login page
        }
    };

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

    const profilePictureUrl = userProfile?.profile_picture
        ? supabase.storage.from('profile-pictures').getPublicUrl(userProfile.profile_picture).data.publicUrl
        : 'https://www.gravatar.com/avatar?d=mp&s=100';

    return (
        <nav className={`w-full bg-slate-100 dark:bg-gray-700 flex justify-end px-4 z-50 py-1 drop-shadow ${className}`}>
            <ul className='flex gap-4 items-end z-50 justify-center mr-4'>
                <li className="m-0">
                    <NotificationBell session={session} />
                </li>
                <li className="flex flex-col justify-center items-center m-0">
                    <Image
                        src={profilePictureUrl}
                        alt='profile-img'
                        className='rounded-full shadow-md'
                        width={40}
                        height={40} />
                </li>
                <li className="flex flex-col justify-center items-center m-0">
                    <button onClick={toggleDarkMode} className="p-2 rounded-full">
                        {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-800" />}
                    </button>
                </li>
                <li className="flex flex-col justify-center items-center m-0">
                    <button onClick={handleLogout} className="btn-black-outline dark:bg-gray-900 dark:text-gray-400">Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default UserTopNav;