import React from 'react'
import DimensionSearch from "@/components/DimensionSearch";
import Aside from '@/components/ui/Aside';
import CaterpillarSearch from '@/components/CaterpillarSearch';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext';

const EquipmentDirectory: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>; // or redirect to login page
    }
    return (
        <UserProvider>
            <UserLayout>
        <div className="grid grid-rows-2 h-full justify-items-center items-start w-full pl-[53px]">
            <Aside />

            <div className='absolute top-14'>
                <DimensionSearch />
                <div className='mt-48'><CaterpillarSearch /></div>
            </div>

        </div>
            </UserLayout>
        </UserProvider>
    )
};

export default EquipmentDirectory;