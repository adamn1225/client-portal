import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@lib/initSupabase'; // Adjust the import path as needed

export default function ResetPassword() {
    const router = useRouter();
    const { access_token, refresh_token } = router.query;
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof access_token === 'string' && typeof refresh_token === 'string') {
            supabase.auth.setSession({ access_token, refresh_token });
        }
    }, [access_token, refresh_token]);

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (typeof access_token !== 'string' || typeof refresh_token !== 'string') {
            setError('Invalid or missing token');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password reset successfully!');
            router.push('/login');
        }

        setLoading(false);
    };

    return (
        <div className="w-full h-screen bg-200 flex items-center justify-center">
            <div className="w-full max-w-md p-5 bg-white shadow flex flex-col justify-center items-center text-base">
                <h2 className="text-2xl font-medium mb-4">Reset Password</h2>
                <form className="space-y-4 w-full" onSubmit={handleResetPassword}>
                    <div>
                        <label className="block text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your new password"
                            className="mt-1 pl-2 block w-full text-zinc-950 placeholder:text-zinc-900 border border-zinc-300 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 shadow-md text-stone-100 font-medium bg-zinc-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-zinc-900" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
                {message && <div className="text-green-500 mt-4">{message}</div>}
                {error && <div className="text-red-500 mt-4">{error}</div>}
            </div>
        </div>
    );
}