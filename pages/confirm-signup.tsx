import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';

export default function ConfirmSignup() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const confirmSignup = async () => {
            const { token, type, redirect_to } = router.query;

            if (!token || type !== 'signup') {
                setError('Invalid confirmation URL');
                return;
            }

            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.verifyOtp({
                token: token as string,
                type: 'signup',
                email: router.query.email as string,
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                router.push(redirect_to as string || '/user/profile-setup');
            }

            setLoading(false);
        };

        confirmSignup();
    }, [router.query, supabase, router]);

    return (
        <>
            <Head>
                <title>Confirm Signup</title>
            </Head>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold">Confirm Signup</h2>
                {error && <div className="text-red-500">{error}</div>}
                {success ? (
                    <div className="text-green-500">Signup confirmed successfully! Redirecting...</div>
                ) : (
                    <button
                        onClick={() => { }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={loading}
                    >
                        {loading ? 'Confirming...' : 'Confirm Signup'}
                    </button>
                )}
            </div>
        </>
    );
}