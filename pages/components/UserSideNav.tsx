import React from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { PanelLeftOpen, PanelRightClose, ListCollapse, Workflow, Folders, Signature, Settings, Hammer, NotebookTabs, Handshake, Users, Move3d } from 'lucide-react';
import withProfileCheck from '@/components/hoc/withProfileCheck';

interface UserSideNavProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    className?: string;
}

const UserSideNav: React.FC<UserSideNavProps> = ({ isSidebarOpen, toggleSidebar, className = '' }) => {
    const supabase = useSupabaseClient<Database>();
    const { userProfile } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
                alert('Failed to log out. Please try again.');
            } else {
                router.push('/login'); // Redirect to login page
            }
        } catch (err) {
            console.error('Unexpected error during logout:', err);
            alert('An unexpected error occurred. Please try again.');
            router.push('/login'); // Redirect to login page
        }
    };

    const profilePictureUrl = userProfile?.profile_picture
        ? supabase.storage.from('profile-pictures').getPublicUrl(userProfile.profile_picture).data.publicUrl
        : 'https://www.gravatar.com/avatar?d=mp&s=100';

    return (
        <>
            <div>
                <div className="md:hidden">
                    <button
                        className="fixed z-50 top-1 left-0 p-2 drop-shadow-lg rounded-full"
                        onClick={toggleSidebar}
                    >
                        {isSidebarOpen ? <PanelRightClose size={24} className='text-white z-50 drop-shadow-lg' /> : <PanelLeftOpen size={28} className='z-50 text-zinc-100 dark:text-zinc-100 drop-shadow-lg ' />}
                    </button>
                </div>
                <nav className={`side-navbar pr-0.5 md:pr-1 z-50 flex flex-col h-screen py-6 drop-shadow absolute top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0 z-50' : '-translate-x-full'} transition-transform duration-300 h-screen ease-in-out z-50 ${className}`}>
                    <span className='flex mt-5 md:mt-0 mb-3 items-center justify-center font-bold  flex-nowrap'><Move3d className='size-6 text-red-700' /> <h1 className='text-lg md:mt-0  self-center font-extrabold underline underline-offset-2 tracking-wider'>Heavy Construct</h1></span>
                    <span className="w-full flex flex-col items-center gap-1 justify-center mb-6 border-b border-stone-100/40 pb-4">
                        <h3>Welcome {userProfile?.first_name || 'User'}</h3>
                    </span>
                    <ul className='flex gap-3 flex-col flex-grow space-y-2 overflow-y-auto'>
                        <li className={`w-full flex justify-center mt-0 ${router.pathname == "/user/inventory" ? "active" : ""}`}>
                            <Link href="/user/inventory" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/user/inventory" ? "active" : ""}`}>
                                <span className='flex items-center flex-nowrap justify-normal gap-2 text-xs'><ListCollapse size={'20px'} /> <span className='text-xs md:text-sm'>Inventory Management</span></span>
                            </Link>
                        </li>
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/user/freight-rfq" ? "active" : ""}`}>
                            <Link href="/user/freight-rfq" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/user/freight-rfq" ? "active" : ""}`}>
                                <span className='flex items-center flex-nowrap justify-normal gap-2'><Workflow size={'20px'} /> <span className='text-xs md:text-sm'>Logistics RFQ </span></span>
                            </Link>
                        </li>
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/user/user-documents" ? "active" : ""}`}>
                            <Link href="/user/user-documents" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/user/user-documents" ? "active" : ""}`}>
                                <span className='flex items-center flex-nowrap justify-normal gap-2'><Folders size={'20px'} /> <span className='text-xs md:text-sm'>Documents </span></span>
                            </Link>
                        </li>

                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/user/procurement" ? "active" : ""}`}>
                            <Link href="/user/procurement" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/user/procurement" ? "active" : ""}`}>
                                <span className='w-full flex items-center flex-nowrap justify-normal gap-2'><Signature size={'20px'} /> <span className='text-xs md:text-sm'>Procurement </span></span>
                            </Link>
                        </li>
{/* 
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/user/equipment-directory" ? "active" : ""}`}>
                            <Link href="/user/equipment-directory" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/user/equipment-directory" ? "active" : ""}`}>
                                <span className='w-full flex items-center flex-nowrap justify-normal gap-2'><NotebookTabs size={'20px'} /> <span className='text-xs md:text-sm'>Equipment Directory </span></span>
                            </Link>
                        </li> */}

                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/user/field-planner" ? "active" : ""}`}>
                            <Link href="/user/field-planner" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/user/field-planner" ? "active" : ""}`}>
                                <span className='w-full flex items-center flex-nowrap justify-normal gap-2'><Hammer size={'20px'} /> 
                                    <span className='text-xs md:text-sm'>Field Planner/Management</span></span>
                            </Link>
                        </li>

                    </ul>
                    <ul className='flex flex-col gap-4 justify-end items-center'>
                        <li className={`w-full text-nowrap flex justify-normal m-0 ${router.pathname == "/user/settings" ? "active" : ""}`}>
                            <Link href="/user/settings" className={`logout mt-4 md:mt-0 dark:bg-zinc-300 dark:text-zinc-700 flex items-center justify-center gap-2 font-semibold py-1 w-full ${router.pathname == "/user/settings" ? "active" : ""}`}>
                                <Settings />   Settings
                            </Link>
                        </li>
                        <li className="w-full flex items-center justify-center m-0">
                            <button className="logout dark:bg-zinc-300 dark:text-zinc-700 font-semibold py-1 w-full" onClick={handleLogout}>
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