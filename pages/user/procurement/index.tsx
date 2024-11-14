import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import Procurement from '@/components/procurement/Procurement';
import withProfileCheck from '@/components/hoc/withProfileCheck';

const UserProfilePage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserLayout>
                <Procurement />
            </UserLayout>
        </UserProvider>
    );
};

export default withProfileCheck(UserProfilePage);