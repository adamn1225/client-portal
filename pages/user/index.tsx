import React, { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UserLayout from '@/pages/components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import QuoteRequest from '@/components/QuoteRequest';
import Documents from '@/components/Documents';
import DimensionSearch from "@/components/DimensionSearch";
import FreightInventory from '@/components/FreightInventory';
import UserProfileForm from '@/components/UserProfileForm';
import MapComponentClient from '@/components/drawing/MapComponentClient';

const UserDash: React.FC = () => {
    const session = useSession();
    const [currentView, setCurrentView] = useState('freight-rfq');

    if (!session) {
        return <p>Loading...</p>;
    }

    const renderView = () => {
        switch (currentView) {
            case 'freight-rfq':
                return <QuoteRequest session={session} />;
            case 'inventory':
                return <FreightInventory session={session} />;
            case 'user-documents':
                return <Documents session={session} />;
            case 'equipment-directory':
                return <DimensionSearch />;
            case 'field-planner':
                return <MapComponentClient />;
            case 'settings':
                return <UserProfileForm />;
            default:
                return <QuoteRequest session={session} />;
        }
    };

    return (
        <UserProvider>
            <UserLayout currentView={currentView} setCurrentView={setCurrentView}>
                {renderView()}
            </UserLayout>
        </UserProvider>
    );
};

export default UserDash;