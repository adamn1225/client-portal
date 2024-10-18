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
import TodoList from '@/components/FreightInventory';
import GoalSetting from '@/components/QuoteRequest';

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
                    console.error('Error fetching profile:', error.message);
                } else {
                    setProfileComplete(!!data?.first_name);
                }
            }
        };

        if (session) {
            refreshSession();
            checkProfile();
        }
    }, [session, supabase]);

    useEffect(() => {
        if (session && profileComplete) {
            router.push('/freight-inventory');
        }
    }, [session, profileComplete, router]);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/auth/callback'
                    : 'https://fazytsvctdzbhvsavvwj.supabase.co/auth/v1/callback',
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error.message);
        }
    };

    return (
        <>
            <Head>
                <title>SSTA Reminders & Tasks</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {session ? (
                session.user.email_confirmed_at ? (
                    profileComplete ? (
                        <UserLayout>
                            <div className="w-full flex justify-center items-center p-4">
                                <div className="w-full sm:w-2/3 lg:w-3/4">
                                    <TodoList session={session} />
                                    <GoalSetting session={session} />
                                </div>
                            </div>
                        </UserLayout>
                    ) : (
                        <UserProvider session={session}>
                            <UserLayout>
                                <div className="w-full flex justify-center items-center p-4">
                                    <div className="w-full sm:w-2/3 lg:w-3/4">
                                        <UserProfileForm session={session} />
                                    </div>
                                </div>
                            </UserLayout>
                        </UserProvider>
                    )
                ) : (
                    <div className="w-full h-full bg-200">
                        <div className="min-w-full min-h-screen flex items-center justify-center">
                            <div className="w-full h-full flex justify-center items-center p-4">
                                <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                                    <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                                        Verify Your Email
                                    </span>
                                    <div className="mt-4 text-center">
                                        <p>Please verify your email address to access the application.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="w-full h-full bg-200">
                    <div className="min-w-full min-h-screen flex items-center justify-center">
                        <div className="w-full h-full flex justify-center items-center p-4">
                            <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                                <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                                    Sign In
                                </span>
                                <div className="mt-4">
                                    <Auth
                                        supabaseClient={supabase}
                                        providers={['google']}
                                        appearance={{ theme: ThemeSupa }}
                                        theme="dark"
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p>Don&apos;t have an account?</p>
                                    <Link href="/signup" legacyBehavior>
                                        <a className="text-blue-500">Sign Up</a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;