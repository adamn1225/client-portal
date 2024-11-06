import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../pages/components/Layout';
import Head from 'next/head';

export function AdminSignUp() {
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

        // Check if the email is already registered
        const { data: existingUser, error: existingUserError } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') {
            setError('Error checking existing user');
            setLoading(false);
            return;
        }

        if (existingUser) {
            setError('Email is already registered');
            setLoading(false);
            return;
        }

        // Validate invitation code
        const { data: validCode, error: codeError } = await supabase
            .from('invitation_codes')
            .select('code')
            .eq('code', invitationCode)
            .eq('is_used', false)
            .single();

        if (codeError || !validCode) {
            setError('Invalid or already used invitation code');
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

            // Mark the invitation code as used
            await supabase
                .from('invitation_codes')
                .update({ is_used: true })
                .eq('code', invitationCode);

            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <Head>
                <title>Admin Sign Up</title>
            </Head>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">Admin Sign Up</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success ? (
                    <div className="text-green-500 mb-4">Sign up successful! You can now log in.</div>
                ) : (
                    <form className="w-full max-w-md" onSubmit={handleSignUp}>
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border rounded"
                            disabled={loading}
                        />
                        <label htmlFor="password" className="block mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border rounded"
                            disabled={loading}
                        />
                        <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border rounded"
                            disabled={loading}
                        />
                        <label htmlFor="invitationCode" className="block mb-2">Invitation Code</label>
                        <input
                            type="text"
                            id="invitationCode"
                            value={invitationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border rounded"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded"
                            disabled={loading}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                )}
            </div>
        </Layout>
    );
}

export default AdminSignUp;