import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import ProfileSetup from '../../components/ProfileSetup';

const ProfileSetupPage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserLayout>
                <ProfileSetup />
            </UserLayout>
        </UserProvider>
    );
};

export default ProfileSetupPage; 