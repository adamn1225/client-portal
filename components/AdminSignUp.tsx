// pages/AdminSignUp.tsx
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../pages/components/Layout';
import Head from 'next/head';

export default function AdminSignUpPage() {
    const supabase = useSupabaseClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invitationCode, setInvitationCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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

        // Validate invitation code
        const { data: validCode, error: codeError } = await supabase
            .from('invitation_codes')
            .select('code')
            .eq('code', invitationCode)
            .single();

        if (codeError || !validCode) {
            setError('Invalid invitation code');
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
                    role: 'admin', // Grant admin role
                });

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }

            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <Head>
                <title>Admin Sign Up</title>
                <meta name="description" content="Sign up for an admin account" />
            </Head>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md bg-white shadow-md rounded">
                    <h2 className="text-2xl font-bold text-center">Admin Sign Up</h2>
                    <div className="xs:w-2/5 md:w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col text-base">
                        <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                            Sign Up
                        </span>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        {success && <div className="text-green-500 text-center mb-4">Sign up successful! Please check your email to confirm your account.</div>}
                        <form className="mt-4" onSubmit={handleSignUp}>
                            <label htmlFor="email" className="mt-4">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <label htmlFor="password" className="mt-4">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <label htmlFor="confirmPassword" className="mt-4">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <label htmlFor="invitationCode" className="mt-4">Invitation Code</label>
                            <input
                                type="text"
                                id="invitationCode"
                                value={invitationCode}
                                onChange={(e) => setInvitationCode(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
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