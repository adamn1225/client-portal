import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import dynamic from 'next/dynamic';
import withProfileCheck from '@/components/hoc/withProfileCheck';

const MapComponentClient = dynamic(() => import('@/components/drawing/MapComponentClient'), { ssr: false });

const UserProfilePage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserLayout>
                <MapComponentClient />
            </UserLayout>
        </UserProvider>
    );
};

export default withProfileCheck(UserProfilePage);