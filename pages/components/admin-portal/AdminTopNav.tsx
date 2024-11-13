import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/initSupabase';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import NotificationBell from '@/components/NotificationBell';
import { useSession, Session } from '@supabase/auth-helpers-react';
import FeedBack from '@/components/FeedBack';
import DarkModeToggle from '@/components/DarkModeToggle';

interface UserTopNavProps {
    session: Session | null;
    className?: string;
}

const UserTopNav: React.FC<UserTopNavProps> = ({ session, className = '' }) => {
    const { userProfile } = useUser();
    const [darkMode, setDarkMode] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string>('https://www.gravatar.com/avatar?d=mp&s=100');

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        if (userProfile?.profile_picture) {
            const profilePicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${userProfile.profile_picture}`;
            setProfilePictureUrl(profilePicUrl);
        }
    }, [userProfile]);

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

    return (
        <>
            <nav className={`md:hidden w-full  max-h-max bg-stone-50 dark:bg-gray-700 flex flex-col md:flex-row gap-1 justify-end px-4 z-50 py-1 drop-shadow ${className}`}>

                <ul className='flex gap-2 md:gap-4 items-center z-50 justify-end mr-4'>
                    <li>
                        <NotificationBell session={session} />
                    </li>

                    <li>
                        <DarkModeToggle />
                    </li>
                    <li className='hidden md:block'>
                        <FeedBack />
                    </li>
                    <li>
                        <Image
                            src={profilePictureUrl}
                            alt='profile-img'
                            className='rounded-full shadow-md'
                            width={40}
                            height={40} />
                    </li>
                </ul>
                <FeedBack />
            </nav>

            <nav className={`hidden w-full bg-stone-50 dark:bg-gray-900 md:flex flex-col md:flex-row gap-1 justify-between px-4 z-50 py-2 drop-shadow ${className}`}>

                <ul className='w-full flex gap-2 md:gap-4 items-center z-50 justify-start pl-64'>
                    <li>
                        <FeedBack />
                    </li>
                    <li>
                        <DarkModeToggle />
                    </li>
                </ul>
                <ul className='w-full flex gap-2 md:gap-4 items-center z-50 justify-end mr-12'>


                    <li>
                        <NotificationBell session={session} />
                    </li>
                    <li>
                        <Image
                            src={profilePictureUrl}
                            alt='profile-img'
                            className='rounded-full shadow-2xl'
                            width={60}
                            height={60} />
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default UserTopNav;