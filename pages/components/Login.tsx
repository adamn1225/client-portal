// components/Login.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import UserLayout from './UserLayout';
import UserProfileForm from '@/components/UserProfileForm';
import { UserProvider } from '@/context/UserContext';
import FreightInventory from '@/components/FreightInventory';


const Login: React.FC = () => {
    const session = useSession();
    const supabase = useSupabaseClient();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [profileComplete, setProfileComplete] = useState<boolean>(false);

    useEffect(() => {
        const refreshSession = async () => {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) console.log('Error refreshing session:', error.message);
        };

        const checkProfile = async () => {
            if (session?.user?.id) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('first_name')
                    .eq('id', session.user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error.message);
                    setError('Error fetching user profile');
                } else {
                    setProfileComplete(!!data?.first_name);
                }
            }
        };

        refreshSession();
        checkProfile();
    }, [session, supabase]);

    if (!session) {
        return (
            <div>
                <Head>
                    <title>Login</title>
                </Head>
                <Auth
                    supabaseClient={supabase}
                    providers={['google']}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark"
                />
                {error && <p className="text-red-500">{error}</p>}
            </div>
        );
    }

    if (!profileComplete) {
        return (
            <UserProvider>
                <UserProfileForm />
            </UserProvider>
        );
    }

    return (
        <UserProvider>
            <UserLayout>
                <FreightInventory session={session} />
            </UserLayout>
        </UserProvider>
    );
};

export default Login;