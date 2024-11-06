import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useSession } from '@supabase/auth-helpers-react';
import { useUser } from '@/context/UserContext';
import FreightInventory from '@/components/FreightInventory';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const HomePageContent = () => {
    const { userProfile } = useUser();
    const [profileComplete, setProfileComplete] = useState<boolean>(false);

    useEffect(() => {
        if (userProfile) {
            console.log('User Profile:', userProfile);
            console.log('Is Admin:', userProfile.role === 'admin');
            setProfileComplete(true);
        }
    }, [userProfile]);

    return (
        <>
            <Head>
                <title>NTS Client Portal</title>
                <meta name="description" content="Welcome to SSTA Reminders & Tasks" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="w-full flex justify-center items-center p-4">
                <div className="w-full sm:w-2/3 lg:w-3/4">
                    {userProfile?.role === 'admin' ? (
                        <AdminAnalytics />
                    ) : (
                        <FreightInventory session={useSession()} />
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePageContent;