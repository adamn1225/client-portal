import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';

export default function ConfirmSignup() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const [confirmationUrl, setConfirmationUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const { confirmation_url } = router.query;
        if (confirmation_url) {
            setConfirmationUrl(decodeURIComponent(confirmation_url as string));
        }
    }, [router.query]);

    const handleConfirm = async () => {
        if (!confirmationUrl) {
            setError('Invalid confirmation URL');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(confirmationUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
            });
            if (response.ok) {
                setSuccess(true);
            } else {
                setError('Failed to confirm signup');
            }
        } catch (err) {
            setError('Failed to confirm signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Confirm Signup</title>
            </Head>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold">Confirm Signup</h2>
                {error && <div className="text-red-500">{error}</div>}
                {success ? (
                    <div className="text-green-500">Signup confirmed successfully!</div>
                ) : (
                    <button
                        onClick={handleConfirm}
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