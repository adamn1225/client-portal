import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';

const AdminSideNav = ({ className = '' }) => {
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

    return (
        <nav className={`side-navbar bg-slate-700 flex flex-col h-screen z-50 py-6 drop-shadow absolute top-0 left-0 ${className}`}>
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
                <li className="w-full text-center flex justify-center m-0">
                    <Link href="/settings" className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                      Admin Settings
                    </Link>
                </li>
                <li className="w-full text-center flex justify-center m-0">
                    <Link href="/freight-inventory" className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                        Client&apos;s Freight Inventory
                    </Link>
                </li>
                <li className="w-full text-center flex justify-center m-0">
                    <Link href="/admin-quote-requests" className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                    Client&apos;s Freight Transport
                    </Link>
                </li>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                        Inbox
                    </button>
                </li>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 text-nowrap font-bold px-4 py-1 rounded-sm w-4/5">
                        Client Live Chat
                    </button>
                </li>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 text-nowrap font-bold px-4 py-1 rounded-sm w-4/5">
                        Analytics
                    </button>
                </li>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 text-nowrap font-bold px-4 py-1 rounded-sm w-4/5">
                        Documents
                    </button>
                </li>
            </ul>
            <ul className='flex flex-col justify-end items-center'>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-3/4" onClick={handleLogout}>
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default AdminSideNav;