import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '../components/UserLayout';
import UserProfileForm from '@/components/UserProfileForm';

const UserProfilePage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserLayout>
            <UserProfileForm session={session} />
        </UserLayout>
    );
};

export default UserProfilePage;