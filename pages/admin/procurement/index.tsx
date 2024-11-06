// admin-dash/index.tsx
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import AdminSignUp from '@/components/AdminSignUp';
import Procurement from '@/components/procurement/Procurement';

const AdminProcurement = () => {
    const session = useSession();
    const supabase = useSupabaseClient<Database>();

    // Add your admin dashboard functionalities here

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <Procurement />
        </div>
    );
};

export default AdminProcurement;