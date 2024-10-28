import Head from 'next/head';
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import Layout from './components/Layout';
import { useState } from 'react';

export default function LoginPage() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [error, setError] = useState<string | null>(null);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/auth/callback'
                    : 'https://ssta-nts-client.netlify.app/auth/callback',
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error.message);
            setError('Error signing in with Google. Please try again.');
        }
    };


    return (
        <Layout>
            <Head>
                <title>Login - NTS Client Portal</title>
                <meta name="description" content="Login to NTS Client Portal" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="w-full h-full bg-200">
                <div className="min-w-full min-h-screen flex items-center justify-center">
                    <div className="w-full h-full flex justify-center items-center p-4">
                        <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                            <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                                Sign In
                            </span>
                            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
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
        </Layout>
    );
}