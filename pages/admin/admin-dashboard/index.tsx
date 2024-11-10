import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminLayout from '../../components/admin-portal/AdminLayout'; // Ensure consistent casing

const AdminDashboard = () => {
    const session = useSession();
    const supabase = useSupabaseClient<Database>();

    // Add your admin dashboard functionalities here

    return (
        <AdminLayout>
            <div className='flex justify-start mt-28 h-full'>
                <AdminAnalytics />
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;