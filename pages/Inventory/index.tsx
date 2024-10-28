// pages/freight-inventory/page.tsx
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UserLayout from '../components/UserLayout';
import FreightInventory from '@/components/FreightInventory';
import { UserProvider } from '@/context/UserContext';

const FreightInventoryPage = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>; // or redirect to login page
    }

    return (
        <UserProvider>
            <UserLayout>
                <FreightInventory session={session} />
            </UserLayout>
        </UserProvider>
    );
};

export default FreightInventoryPage;