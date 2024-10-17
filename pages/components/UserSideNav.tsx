import React, { useEffect, useState } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { Database } from '@/lib/schema';
import Link from 'next/link';

interface UserSideNavProps {
    session: Session;
    className?: string; // Define className prop
}

const UserSideNav = ({ session, className = '' }: UserSideNavProps) => {
    const supabase = useSupabaseClient<Database>();
    const [firstName, setFirstName] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('first_name')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error.message);
            } else {
                setFirstName(data.first_name);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session, supabase]);

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

    return (
        <nav className={`side-navbar bg-slate-700 flex flex-col h-screen z-50 py-6 drop-shadow absolute top-0 left-0 ${className}`}>
            <h1 className='text-xl mb-4 self-center'>NTS Client Portal</h1>
            <ul className='flex gap-3 flex-col justify-start items-center flex-grow space-y-1 overflow-y-auto'>
                <li className="w-full flex flex-col items-center gap-1 justify-center m-0">
                    <Image
                        src='https://www.gravatar.com/avatar?d=mp&s=100'
                        alt='profile-img'
                        className='rounded-full w-16 h-16'
                        width={100}
                        height={100}
                    />
                    <h3>Welcome {firstName || 'User'}</h3>
                </li>
                <li className="w-full text-center flex justify-center m-0">
                    <Link href="/freight-inventory" className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                        Freight Inventory
                    </Link>
                </li>
                <li className="w-full text-center flex justify-center m-0">
                    <Link href="/freight-transport" className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                        Freight Transport
                    </Link>
                </li>
                <li className="w-full text-center flex justify-center m-0">
                    <Link href="/settings" className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                        Settings
                    </Link>
                </li>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 font-bold px-4 py-1 rounded-sm w-4/5">
                        Documents/Resources
                    </button>
                </li>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 text-nowrap font-bold px-4 py-1 rounded-sm w-4/5">
                        Community Forum
                    </button>
                </li>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-100 text-slate-900 text-nowrap font-bold px-4 py-1 rounded-sm w-4/5">
                        Team Collaboration
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

export default UserSideNav;