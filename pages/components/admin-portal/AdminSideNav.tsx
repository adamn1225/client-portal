import React from 'react';
import { useRouter } from "next/router";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { PanelLeftOpen, PanelRightClose, ListCollapse, Workflow, Folders, Signature, Settings, Hammer, Handshake } from 'lucide-react';

interface AdminSideNavProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    className?: string;
}

const AdminSideNav: React.FC<AdminSideNavProps> = ({ isSidebarOpen, toggleSidebar, className = '' }) => {
    const supabase = useSupabaseClient<Database>();
    const { userProfile } = useUser();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
                alert('Failed to log out. Please try again.');
                window.location.href = '/login';
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error('Unexpected error during logout:', err);
            alert('An unexpected error occurred. Please try again.');
            window.location.href = '/login';
        }
    };

    const profilePictureUrl = userProfile?.profile_picture
        ? supabase.storage.from('profile-pictures').getPublicUrl(userProfile.profile_picture).data.publicUrl
        : 'https://www.gravatar.com/avatar?d=mp&s=100';

    const router = useRouter();

    return (
        <div>
            <div className="md:hidden">
                <button
                    className="fixed left-1 top-1 z-50 p-2 rounded-full"
                    onClick={toggleSidebar}
                >
                    {isSidebarOpen ? <PanelRightClose size={24} className='text-white' /> : <PanelLeftOpen size={28} className='text-gray-900' />}
                </button>
            </div>
            <nav className={`side-navbar bg-slate-700 flex flex-col h-screen z-40 py-6 drop-shadow absolute top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out ${className}`}>
                <h1 className='text-xl mb-4 self-center'>NTS Client Portal</h1>
                <ul className='flex gap-3 flex-col justify-start items-center flex-grow space-y-1 overflow-y-auto'>
                    <li className="w-full flex flex-col items-center gap-1 justify-center m-0">
                        <Image
                            src={profilePictureUrl}
                            alt='profile-img'
                            className='rounded-full w-16 h-16'
                            width={100}
                            height={100}
                        />
                        <h3>Welcome {userProfile?.first_name || 'User'}</h3>
                    </li>

                    <li className={`w-full text-base flex justify-center mt-0 ${router.pathname == "/admin-dashboard" ? "active" : ""}`}>
                        <Link href="/admin-dashboard" className={`side-nav-btn text-stone-100 font-bold py-1 w-full ${router.pathname == "/admin-dashboard" ? "active" : ""}`}>
                            Analytics
                        </Link>
                    </li>
                    <li className="w-full text-base flex justify-center m-0">
                        <Link href="/admin-quote-requests" className="side-nav-btn text-slate-900 font-bold py-1 w-full">
                            Client&apos;s Logistics RFQ
                        </Link>
                    </li>
                    <li className={`w-full text-base flex justify-center mt-0 ${router.pathname == "/admin-quote-requests" ? "active" : ""}`}>
                        <Link href="/admin-quote-requests" className={`side-nav-btn text-stone-100 font-bold py-1 w-full ${router.pathname == "/admin-quote-requests" ? "active" : ""}`}>
                            Client&apos;s Logistics RFQ
                        </Link>
                    </li>
                    <li className={`w-full text-base flex justify-center mt-0 ${router.pathname == "/" ? "active" : ""}`}>
                        <Link href="/" className={`side-nav-btn text-stone-100 font-bold py-1 w-full ${router.pathname == "/" ? "active" : ""}`}>
                            Client&apos;s Inventory
                        </Link>
                    </li>

                    <li className={`w-full text-base flex justify-normal m-0 ${router.pathname == "/admin-documents" ? "active" : ""}`}>
                        <Link href="/admin-documents" className={`side-nav-btn text-stone-100 font-bold py-1 w-full ${router.pathname == "/admin-documents" ? "active" : ""}`}>
                            Documents
                        </Link>
                    </li>
                    <li className="w-full flex text-base justify-normal m-0">
                        <Link href="/" className="side-nav-btn text-stone-100 text-nowrap font-bold py-1 w-full">
                            Procurements <br />  (coming soon)
                        </Link>
                    </li>

                </ul>
                <ul className='flex flex-col gap-4 justify-end items-center'>
                    <li className={`w-full text-nowrap flex justify-normal m-0 ${router.pathname == "/admin-settings" ? "active" : ""}`}>
                        <Link href="/admin-settings" className={`logout dark:bg-gray-300 dark:text-gray-700 flex items-center justify-center gap-2 font-bold py-1 w-full ${router.pathname == "/admin-settings" ? "active" : ""}`}>
                            <Settings />   Settings
                        </Link>
                    </li>
                    <li className="w-full flex items-centerjustify-center m-0">

                        <button className="logout dark:bg-gray-300 dark:text-gray-700 font-bold py-1 w-full" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminSideNav;