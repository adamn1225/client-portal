// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabaseClient, useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

interface UserProfile {
    id: string;
    email: string;
    role: string; // Add role field
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
                console.log('Fetching user profile for ID:', supabaseUser.id); // Debugging
                const { data, error } = await supabase
                    .from('profiles') // Ensure the table name is correct
                    .select('id, email, role')
                    .eq('id', supabaseUser.id)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error.message);
                } else if (data) {
                    console.log('Fetched user profile:', data); // Debugging
                    setUserProfile(data);
                } else {
                    console.error('No user profile found for ID:', supabaseUser.id);
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