import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import AdminSignUp from '@/components/AdminSignUp';
import dynamic from 'next/dynamic';
import AdminLayout from '../../components/admin-portal/AdminLayout'; 
import { UserProvider } from '@/context/UserContext';

// Dynamically import MapComponentClient to ensure it only runs on the client side
const MapComponentClient = dynamic(() => import('@/components/drawing/MapComponentClient'), { ssr: false });

const AdminProcurement = () => {
    const session = useSession();
    const supabase = useSupabaseClient<Database>();

    // Add your admin dashboard functionalities here

    return (
       <UserProvider>
            <AdminLayout>
                <MapComponentClient />
            </AdminLayout>
       </UserProvider>
    );
};

export default AdminProcurement;