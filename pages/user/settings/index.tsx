import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import UserProfileForm from '@/components/UserProfileForm';
import withProfileCheck from '@/components/hoc/withProfileCheck';

const UserProfilePage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserLayout>
                <UserProfileForm />
            </UserLayout>
        </UserProvider>
    );
};

export default withProfileCheck(UserProfilePage);