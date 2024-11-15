import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const CustomSignInForm = () => {
    const supabase = useSupabaseClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message === 'Email not confirmed') {
                setError('Email not confirmed. Please check your email for the confirmation link.');
            } else {
                setError(error.message);
            }
            setLoading(false);
        } else {
            console.log('Session:', data.session);
            // Redirect to dashboard or another page
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        setResendLoading(true);
        setResendSuccess(false);
        setError(null);

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/profile-setup`
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setResendSuccess(true);
        }

        setResendLoading(false);
    };

    return (
        <div>
            <form onSubmit={handleSignIn}>
                <label htmlFor="email" className="mt-4">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 mt-2 border rounded"
                    disabled={loading}
                    autoComplete="email"
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
                    autoComplete="current-password"
                />
                <button
                    type="submit"
                    className="w-full body-btn-btn"
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            {error && (
                <div className="text-red-500 text-center mt-4">
                    {error}
                    {error === 'Email not confirmed. Please check your email for the confirmation link.' && (
                        <button
                            onClick={handleResendConfirmation}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={resendLoading}
                        >
                            {resendLoading ? 'Resending...' : 'Resend Confirmation Email'}
                        </button>
                    )}
                    {resendSuccess && <div className="text-green-500 mt-2">Confirmation email resent successfully!</div>}
                </div>
            )}
        </div>
    );
};

export default CustomSignInForm;