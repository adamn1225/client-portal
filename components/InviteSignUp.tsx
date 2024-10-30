import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../pages/components/Layout';
import Head from 'next/head';
import { Database } from '@lib/schema';

export default function InviteSignUpPage() {
    const router = useRouter();
    const { token } = router.query;
    const supabase = useSupabaseClient<Database>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchInvitation = async () => {
            if (token) {
                const { data, error } = await supabase
                    .from('invitations')
                    .select('email')
                    .eq('token', token)
                    .eq('is_used', false)
                    .single();

                if (error || !data) {
                    setError('Invalid or expired invitation token');
                } else {
                    setEmail(data.email as string);
                }
            }
        };

        fetchInvitation();
    }, [token, supabase]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        if (user) {
            // Store additional user information in the profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    role: 'user', // Default role
                });

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }

            // Mark the invitation token as used
            await supabase
                .from('invitations')
                .update({ is_used: true })
                .eq('token', token);

            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <Head>
                <title>Sign Up</title>
                <meta name="description" content="Sign up for an account" />
            </Head>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md bg-white shadow-md rounded">
                    <h2 className="text-2xl font-bold text-center">NTS Portal</h2>
                    <div className="xs:w-full md:w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col gap-2 text-base">
                        <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                            Sign Up
                        </span>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        {success && <div className="text-green-500 text-center mb-4">Sign up successful! Please check your email to confirm your account.</div>}
                        <form className="mt-4 flex flex-col gap-1" onSubmit={handleSignUp}>
                            <label htmlFor="email">Email
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    readOnly
                                    className="w-full p-2 border rounded"
                                    disabled
                                /></label>
                            <label htmlFor="password" className="mt-4">Password
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded"
                                    disabled={loading}
                                /></label>
                            <label htmlFor="confirmPassword" className="mt-4">Confirm Password
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded"
                                    disabled={loading}
                                /></label>
                            <button
                                type="submit"
                                className="w-full p-2 mt-4 bg-blue-500 text-white rounded"
                                disabled={loading}
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}