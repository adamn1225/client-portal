import React from 'react';
import { useRouter } from "next/router";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, PanelLeftOpen, PanelRightClose } from 'lucide-react';

interface UserSideNavProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    className?: string;
}

const UserSideNav: React.FC<UserSideNavProps> = ({ isSidebarOpen, toggleSidebar, className = '' }) => {
    const supabase = useSupabaseClient<Database>();
    const { userProfile } = useUser();

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

    const profilePictureUrl = userProfile?.profile_picture
        ? supabase.storage.from('profile-pictures').getPublicUrl(userProfile.profile_picture).data.publicUrl
        : 'https://www.gravatar.com/avatar?d=mp&s=100';
    const router = useRouter();
    return (
        <>
            <div>
                <button
                    className="fixed left-1 top-1 p-2 rounded-full"
                    onClick={toggleSidebar}
                >
                    {isSidebarOpen ? <PanelRightClose size={24} className='text-white' /> : <PanelLeftOpen size={28} className='text-gray-900' />}
                </button>
                <nav className={`side-navbar pr-0.5 max-w-max bg-zinc-800 flex flex-col h-screen py-6 drop-shadow absolute top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out ${className}`}>
                    <h1 className='text-xl mb-4 self-center'>NTS Client Portal</h1>
                    <ul className='flex gap-3 flex-col flex-grow space-y-1 overflow-y-auto'>
                        <li className="w-full flex flex-col items-center gap-1 justify-center m-0">
                            <Image
                                src={profilePictureUrl}
                                alt='profile-img'
                                className='rounded-full w-16 h-16'
                                width={100}
                                height={100} />
                            <h3>Welcome {userProfile?.first_name || 'User'}</h3>
                        </li>
                        <li className={`w-full text-center flex justify-center m-0 ${router.pathname == "/freight-inventory" ? "active" : ""}`}>
                            <Link href="/freight-inventory" className={`side-nav-btn text-stone-100 font-bold py-1 w-full ${router.pathname == "/freight-inventory" ? "active" : ""}`}>
                                Freight Inventory
                            </Link>
                        </li>
                        <li className={`w-full text-center flex justify-center m-0 ${router.pathname == "/freight-transport" ? "active" : ""}`}>
                            <Link href="/freight-transport" className={`side-nav-btn text-stone-100 font-bold py-1 w-full ${router.pathname == "/freight-transport" ? "active" : ""}`}>
                                Freight Transport
                            </Link>
                        </li>
                        <li className={`w-full text-center flex justify-center m-0 ${router.pathname == "/settings" ? "active" : ""}`}>
                            <Link href="/settings" className={`side-nav-btn text-stone-100 font-bold py-1 w-full ${router.pathname == "/settings" ? "active" : ""}`}>
                                Settings
                            </Link>
                        </li>
                        <li className="w-full flex justify-center m-0">
                            <button className="side-nav-btn text-stone-100 text-nowrap font-bold py-1 w-full">
                                Documents/Resources
                            </button>
                        </li>
                        <li className="w-full flex justify-center m-0">
                            <button className="side-nav-btn text-stone-100 text-nowrap font-bold py-1 w-full">
                                Community Forum
                            </button>
                        </li>
                        <li className="w-full flex justify-center m-0">
                            <button className="side-nav-btn text-stone-100 text-nowrap font-bold py-1 w-full">
                                Team Collaboration
                            </button>
                        </li>
                    </ul>
                    <ul className='flex flex-col justify-end items-center'>
                        <li className="w-full flex justify-center m-0">
                            <button className="side-nav-btn text-stone-100 font-bold py-1 w-full" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default UserSideNav;