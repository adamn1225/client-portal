// pages/index.tsx
import React, { useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UserLayout from '../components/UserLayout';
import FreightInventory from '@/components/FreightInventory';



const IndexPage = () => {
    const session = useSession();

    return (
        <UserLayout>
            <FreightInventory session={session} />
        </UserLayout>
    );
};

export default IndexPage;