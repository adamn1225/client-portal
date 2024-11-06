import React from 'react'
import DimensionSearch from "@/components/DimensionSearch";
import Aside from '@/components/ui/Aside';
import CaterpillarSearch from '@/components/CaterpillarSearch';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import AdminLayout from '@/pages/components/admin-portal/AdminLayout';
import { UserProvider } from '@/context/UserContext';

const EquipmentDirectory: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>; // or redirect to login page
    }
    return (
        <UserProvider>
            <AdminLayout>
                
                

                
                        <span className='flex flex-col justify-around items-stretch gap-32'>
                            <DimensionSearch />
                            <CaterpillarSearch />
                            
                        </span>
                    

                
            </AdminLayout>
        </UserProvider>
    )
};

export default EquipmentDirectory;