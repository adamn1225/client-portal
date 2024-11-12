import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../components/Layout';
import UserLayout from '../components/UserLayout';
import AdminLayout from '../components/admin-portal/AdminLayout';
import { UserProvider, useUser } from '@/context/UserContext';
import CustomSignInForm from '@/components/CustomSignInForm';
import { Move3d } from 'lucide-react';
import HomePageContent from '../components/HomePageContent';

interface UserProfile {
    id: string;
    email: string;
    role: string;
    inserted_at: string;
    first_name?: string | null;
    last_name?: string | null;
    company_name?: string | null;
    profile_picture?: string | null;
    address?: string | null;
    phone_number?: string | null;
}

export default function DashboardPage() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Session:', session);

        const createUserProfile = async () => {
            if (session?.user) {
                const { id, email } = session.user;

                const { data: existingUser, error: checkError } = await supabase
                    .from('profiles')
                    .select('id, email, role, inserted_at')
                    .eq('email', email)
                    .single();

                if (checkError && checkError.code !== 'PGRST116') {
                    console.error(`Error checking user ${id}:`, checkError.message);
                    return;
                }

                if (existingUser) {
                    console.log(`User with email ${email} already exists. Skipping insertion.`);
                    setUserProfile(existingUser as UserProfile);
                    return;
                }

                const { data, error } = await supabase
                    .from('profiles')
                    .insert({
                        id,
                        email,
                        role: 'user',
                        inserted_at: new Date().toISOString(),
                    })
                    .select();

                if (error) {
                    console.error('Error creating/updating user profile:', error.message);
                } else {
                    console.log('User profile created/updated:', data);
                    setUserProfile(data[0] as UserProfile);
                }
            }
        };

        if (session) {
            createUserProfile();
        }
    }, [session, supabase]);

    const handleResendConfirmation = async () => {
        setResendLoading(true);
        setResendSuccess(false);
        setError(null);

        if (session?.user?.email) {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: session.user.email,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/user/profile-setup`
                }
            });

            if (error) {
                setError(error.message);
            } else {
                setResendSuccess(true);
            }
        } else {
            setError('No email found for the current session.');
        }

        setResendLoading(false);
    };

    if (!session) {
        return (
            <>
                <Head>
                    <title>Heavy Construct</title>
                    <meta name="description" content="Welcome to SSTA Reminders & Tasks" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/hc-28.png" />
                </Head>
                <div className="w-full h-screen bg-200">
                    <div className="min-w-full min-h-screen grid grid-cols-1 md:grid-cols-2 ">

                        <div className="hidden md:block h-full w-full md:h-full col-span-1 bg-gray-900">
                            <div className='absolute top-5 left-5'>
                                <h1 className='text-stone-100 font-medium text-3xl flex gap-2 items-center'><Move3d /> Heavy Construct</h1>
                            </div>
                            <div className='hidden h-5/6 w-full md:flex items-end justify-center'>
                                <h1 className='text-stone-100 font-medium text-xl italic'>Your trusted partner in Inventory Management, Procurement, and Logistics.</h1>
                            </div>
                        </div>

                        <div className='sm:row-span-1 md:col-span-1 w-full h-full flex flex-col justify-center items-center '>
                            <div className='absolute top-5 right-5'>
                                <Link href="/signup" legacyBehavior>
                                    <a className="light-dark-btn">Sign Up</a>
                                </Link>
                            </div>
                            <div className=" w-full text-gray-900 h-full sm:h-auto sm:w-full max-w-md p-5 bg-white shadow flex flex-col justify-center items-center text-base">
                                <span className="font-sans text-4xl font-medium text-center pb-2 mb-1 border-b mx-4 align-center">
                                    Heavy Construct
                                </span>
                                <span className="font-sans text-2xl text-center pb-2 mb-1 border-b mx-4 align-center">
                                    Sign In
                                </span>
                                <div className="mt-4">
                                    <CustomSignInForm />
                                </div>
                                <div className="mt-4 text-center">
                                    <p>Don&apos;t have an account?</p>
                                    <Link href="/signup" legacyBehavior>
                                        <a className="text-gray-900 font-semibold hover:underline">Sign Up</a>
                                    </Link>
                                </div>
                                <div className='md:hidden h-5/6 w-full flex items-end justify-center'>
                                    <h1 className='text-gray-900 font-medium w-full text-lg text-center italic'>Your trusted partner in Inventory Management, Procurement, and Logistics.</h1>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </>
        );
    }

    if (!session.user.email_confirmed_at) {
        return (
            <Layout>
                <Head>
                    <title>NTS Client Portal</title>
                    <meta name="description" content="Welcome to SSTA Reminders & Tasks" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/hc-28.png" />
                </Head>
                <div className="w-full h-full bg-200">
                    <div className="min-w-full min-h-screen flex items-center justify-center">
                        <div className="w-full h-full flex justify-center items-center p-4">
                            <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                                <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                                    Verify Your Email
                                </span>
                                <div className="mt-4 text-center">
                                    <p>Please verify your email address to access the application.</p>
                                    <button
                                        onClick={handleResendConfirmation}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                        disabled={resendLoading}
                                    >
                                        {resendLoading ? 'Resending...' : 'Resend Confirmation Email'}
                                    </button>
                                    {resendSuccess && <div className="text-green-500 mt-2">Confirmation email resent successfully!</div>}
                                    {error && <div className="text-red-500 mt-2">{error}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <UserProvider>
            {userProfile?.role === 'admin' ? (
                <AdminLayout>
                    <HomePageContent />
                </AdminLayout>
            ) : (
                <UserLayout>
                        <div className='md:layout w-full'>
                            <main className="w-full">
                                <div className="w-full fixed top-0 left-0 md:left-9 mt-24">
                                    <HomePageContent />
                                </div>
                                </main>
                        </div>
                </UserLayout>
            )}
        </UserProvider>
    );
}