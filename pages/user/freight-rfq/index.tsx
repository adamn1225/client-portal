// pages/freight-transport/index.tsx
import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import dynamic from 'next/dynamic';
import { UserProvider } from '@/context/UserContext';
import ChromeQuoteRequest from '@/components/ChromeQuoteRequest';
import withProfileCheck from '@/components/hoc/withProfileCheck';

const UserLayout = dynamic(() => import('@/pages/components/UserLayout'));
const QuoteRequest = dynamic(() => import('@/components/QuoteRequest'));

const FreightTransportPage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <UserProvider>
            <UserLayout>
                <QuoteRequest session={session} />
                <ChromeQuoteRequest session={session} />
            </UserLayout>
        </UserProvider>
    );
};

export default withProfileCheck(FreightTransportPage);