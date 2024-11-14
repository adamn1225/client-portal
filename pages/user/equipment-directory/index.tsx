import React from 'react'
import DimensionSearch from "@/components/DimensionSearch";
import Aside from '@/components/ui/Aside';
import CaterpillarSearch from '@/components/CaterpillarSearch';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import withProfileCheck from '@/components/hoc/withProfileCheck';

const EquipmentDirectory: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>; // or redirect to login page
    }
    return (
        <UserProvider>
            <UserLayout>
                <span className='flex flex-col justify-around items-stretch gap-32'>
                    <DimensionSearch />
                    <CaterpillarSearch />
                </span>
            </UserLayout>
        </UserProvider>
    )
};

export default withProfileCheck(EquipmentDirectory);