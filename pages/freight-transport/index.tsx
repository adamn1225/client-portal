// pages/settings/index.tsx
import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '../components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import UserProfileForm from '@/components/UserProfileForm';

const UserProfilePage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider session={session}>
            <UserLayout>
                <UserProfileForm session={session} />
            </UserLayout>
        </UserProvider>
    );
};

export default UserProfilePage;