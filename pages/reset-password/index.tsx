import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@lib/database'; // Import the Supabase client

export default function ResetPassword() {
    const router = useRouter();
    const { access_token } = router.query;
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (!access_token) {
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
                            className="mt-1 pl-2 block w-full text-gray-950 placeholder:text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 shadow-md text-stone-100 font-medium bg-gray-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-gray-900" disabled={loading}>
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