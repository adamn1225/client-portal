import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabaseClient, useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
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
}

interface UserContextType {
    userProfile: UserProfile | null;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const supabase = useSupabaseClient<Database>();
    const supabaseUser = useSupabaseUser();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (supabaseUser) {
                const { data, error } = await supabase
                    .from('users') // Ensure the table name is correct
                    .select('id, email, first_name, last_name, company_name, address, phone_number, profile_picture')
                    .eq('id', supabaseUser.id)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error.message);
                } else {
                    setUserProfile(data);
                }
            }
        };

        fetchUserProfile();
    }, [supabaseUser, supabase]);

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