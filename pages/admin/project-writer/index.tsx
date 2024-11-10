import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import AdminLayout from '@/pages/components/admin-portal/AdminLayout';
import { UserProvider } from '@/context/UserContext';
import dynamic from 'next/dynamic';

const MapComponentClient = dynamic(() => import('@/components/drawing/MapComponentClient'), { ssr: false });

const UserProfilePage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <AdminLayout>
                <MapComponentClient />
            </AdminLayout>
        </UserProvider>
    );
};

export default UserProfilePage;