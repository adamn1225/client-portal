// pages/freight-inventory/page.tsx
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import AdminLayout from '../../components/admin-portal/AdminLayout';
import FreightInventory from '@/components/FreightInventory';
import { UserProvider } from '@/context/UserContext';

const FreightInventoryPage = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>; // or redirect to login page
    }

    return (
        <UserProvider>
            <AdminLayout>
                <FreightInventory session={session} />
            </AdminLayout>
        </UserProvider>
    );
};

export default FreightInventoryPage;