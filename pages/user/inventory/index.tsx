// pages/freight-inventory/page.tsx
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import FreightInventory from '@/components/FreightInventory';
import { UserProvider } from '@/context/UserContext';
import withProfileCheck from '@/components/hoc/withProfileCheck';

const FreightInventoryPage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserLayout>
                <FreightInventory session={session} />
            </UserLayout>
        </UserProvider>
    );
};

export default withProfileCheck(FreightInventoryPage);