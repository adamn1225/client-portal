// admin-dash/index.tsx
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import AdminSignUp from '@/components/AdminSignUp';
import Procurement from '@/components/procurement/Procurement';
import AdminLayout from '../../components/admin-portal/AdminLayout'; 
import { UserProvider } from '@/context/UserContext';

const AdminProcurement = () => {
    const session = useSession();
    const supabase = useSupabaseClient<Database>();

    // Add your admin dashboard functionalities here

    return (
       <UserProvider>
            <AdminLayout>
                <Procurement />
            </AdminLayout>
       </UserProvider>
    );
};

export default AdminProcurement;