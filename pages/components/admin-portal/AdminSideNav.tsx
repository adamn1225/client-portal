import React from 'react';
import { useRouter } from "next/router";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { PanelLeftOpen, PanelRightClose, ListCollapse, Workflow, Folders, Signature, Settings, ChartArea, Handshake, NotebookTabs, Hammer } from 'lucide-react';

interface AdminSideNavProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    className?: string;
}

const AdminSideNav: React.FC<AdminSideNavProps> = ({ isSidebarOpen, toggleSidebar, className = '' }) => {
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
                        {isSidebarOpen ? <PanelRightClose size={24} className='text-white z-50 drop-shadow-lg' /> : <PanelLeftOpen size={28} className='z-50 text-gray-900 dark:text-slate-100 drop-shadow-lg ' />}
                    </button>
                </div>
                <nav className={`side-navbar z-50 flex flex-col h-screen py-6 drop-shadow absolute top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0 z-50' : '-translate-x-full'} transition-transform duration-300 h-screen ease-in-out z-50 ${className}`}>
                    <h1 className='text-xl mt-4 md:mt-0 mb-4 self-center dark:text-amber-400 font-semibold underline underline-offset-2 tracking-wider'>NTS Client Portal</h1>
                    <div className="w-full flex flex-col items-center gap-1 justify-center mb-6 border-b border-stone-100/40 pb-4">
                        <h3>Welcome {userProfile?.first_name || 'User'}</h3>
                    </div>
                    <ul className='flex gap-3 flex-col flex-grow space-y-1 overflow-y-hidden'>
                        <li className={`w-full flex justify-center mt-0 ${router.pathname == "/admin/admin-dashboard" ? "active" : ""}`}>
                            <Link href="/admin/admin-dashboard" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/admin/admin-dashboard" ? "active" : ""}`}>
                                <span className='flex items-center flex-nowrap justify-normal gap-2 text-xs'><ChartArea size={'20px'} /> <span className='text-xs md:text-sm'>Analytics</span></span>
                            </Link>
                        </li>
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/admin/admin-quote-requests" ? "active" : ""}`}>
                            <Link href="/admin/admin-quote-requests" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/admin/admin-quote-requests" ? "active" : ""}`}>
                                <span className='flex items-center flex-nowrap justify-normal gap-2'><Workflow size={'20px'} /> <span className='text-xs md:text-sm'>Client&apos;s Logistics RFQ</span></span>
                            </Link>
                        </li>
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/admin/inventory" ? "active" : ""}`}>
                            <Link href="/admin/inventory" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/admin/inventory" ? "active" : ""}`}>
                                <span className='flex items-center flex-nowrap justify-normal gap-2'><ListCollapse size={'20px'} /> <span className='text-xs md:text-sm'>Client&apos;s Inventory</span></span>
                            </Link>
                        </li>
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/admin/admin-documents" ? "active" : ""}`}>
                            <Link href="/admin/admin-documents" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/admin/admin-documents" ? "active" : ""}`}>
                                <span className='w-full flex items-center flex-nowrap justify-normal gap-2'><Folders size={'20px'} /> <span className='text-xs md:text-sm'>Documents</span></span>
                            </Link>
                        </li>
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/admin/procurement" ? "active" : ""}`}>
                            <Link href="/admin/procurement" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/admin/procurement" ? "active" : ""}`}>
                                <span className='w-full flex items-center flex-nowrap justify-normal gap-2'><Signature size={'20px'} /> <span className='text-xs md:text-sm'>Procurements</span></span>
                            </Link>
                        </li>
                        
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/admin/project-writer" ? "active" : ""}`}>
                            <Link href="/admin/project-writer" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/admin/project-writer" ? "active" : ""}`}>
                                <span className='w-full flex items-center flex-nowrap justify-normal gap-2'><Hammer size={'20px'} /> <span className='text-xs md:text-sm'>Project Writer </span></span>
                            </Link>
                        </li>
                        <li className={`w-full flex justify-normal m-0 ${router.pathname == "/admin/equipment-directory" ? "active" : ""}`}>
                            <Link href="/admin/equipment-directory" className={`side-nav-btn text-stone-100 font-semibold py-1 w-full ${router.pathname == "/admin/equipment-directory" ? "active" : ""}`}>
                                <span className='w-full flex items-center flex-nowrap justify-normal gap-2'><NotebookTabs size={'20px'} /> <span className='text-xs md:text-sm'>Equipment Directory </span></span>
                            </Link>
                        </li>
        
                    </ul>
                    <ul className='flex flex-col gap-4 justify-end items-center'>
                        <li className={`w-full text-nowrap flex justify-normal m-0 ${router.pathname == "/admin/admin-settings" ? "active" : ""}`}>
                            <Link href="/admin/admin-settings" className={`logout mt-4 md:mt-0 dark:bg-gray-300 dark:text-gray-700 flex items-center justify-center gap-2 font-semibold py-1 w-full ${router.pathname == "/admin/admin-settings" ? "active" : ""}`}>
                                <Settings />   Settings
                            </Link>
                        </li>
                        <li className="w-full flex items-center justify-center m-0">
                            <button className="logout dark:bg-gray-300 dark:text-gray-700 font-semibold py-1 w-full" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSideNav;