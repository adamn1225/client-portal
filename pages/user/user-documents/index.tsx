import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext'; 
import Documents from '@/components/Documents';
import withProfileCheck from '@/components/hoc/withProfileCheck';

const UserDocuments: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserLayout>
                <Documents session={session} />
            </UserLayout>
        </UserProvider>
    );
};

export default withProfileCheck(UserDocuments);