// admin-dash/index.tsx
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Procurement from '@/components/procurement/Procurement';
import AdminLayout from '../../components/admin-portal/AdminLayout'; 
import { UserProvider } from '@/context/UserContext';

const AdminProcurement = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>; // or redirect to login page
    }

    return (
       <UserProvider>
            <AdminLayout>
                <Procurement />
            </AdminLayout>
       </UserProvider>
    );
};

export default AdminProcurement;