import React from 'react';
import { useSession, useUser } from '@supabase/auth-helpers-react';
import FreightInventory from '@/components/FreightInventory';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const Hero = () => {
    const session = useSession();
    const user = useUser();

    return (
        <div className="w-full flex justify-center items-center p-4">
            <div className="w-full sm:w-2/3 lg:w-3/4">
                {user?.role === 'admin' ? (
                    <AdminAnalytics />
                ) : (
                    <FreightInventory session={session} />
                )}
            </div>
        </div>
    );
};

export default Hero;