import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@lib/database'; // Adjust the import path as needed

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password reset email sent successfully!');
        }

        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Forgot Password</title>
                <meta name="description" content="Forgot Password" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/hc-28.png" />
            </Head>
            <div className="w-full h-screen bg-200 flex items-center justify-center">
                <div className="w-full max-w-md p-5 bg-white shadow flex flex-col justify-center items-center text-base">
                    <h2 className="text-2xl font-medium mb-4">Forgot Password</h2>
                    <form className="space-y-4 w-full" onSubmit={handleForgotPassword}>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="mt-1 pl-2 block w-full text-zinc-950 placeholder:text-zinc-900 border border-zinc-300 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-4 py-2 shadow-md text-stone-100 font-medium bg-zinc-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-zinc-900" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Email'}
                            </button>
                        </div>
                    </form>
                    {message && <div className="text-green-500 mt-4">{message}</div>}
                    {error && <div className="text-red-500 mt-4">{error}</div>}
                    <div className="mt-4 text-center">
                        <Link href="/login" legacyBehavior>
                            <a className="text-zinc-900 font-semibold hover:underline">Back to Login</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}