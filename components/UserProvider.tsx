// UserProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

interface UserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    address: string | null;
    phone_number: string | null;
    profile_picture: string | null;
    role: string;
}

interface UserContextProps {
    userProfile: UserProfile | null;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
    session: Session;
    children: ReactNode; // Explicitly type the children prop
}

export const UserProvider: React.FC<UserProviderProps> = ({ session, children }) => {
    const supabase = useSupabaseClient<Database>();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles') // Ensure the table name is correct
                .select('id, email, first_name, last_name, company_name, address, phone_number, profile_picture, role')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error.message);
            } else {
                setUserProfile(data);
            }
        };

        fetchProfile();
    }, [session, supabase]);

    return (
        <UserContext.Provider value={{ userProfile, setUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};