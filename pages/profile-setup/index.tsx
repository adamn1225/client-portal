import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserTopNav from '@/pages/components/UserTopNav';
import { UserProvider } from '@/context/UserContext';
import ProfileSetup from '@/pages/components/ProfileSetup';

const ProfileSetupPage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserTopNav />
                <ProfileSetup />
        </UserProvider>
    );
};

export default ProfileSetupPage; 