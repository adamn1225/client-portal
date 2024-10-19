import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const AuthCallback = () => {
    const router = useRouter();
    const supabase = useSupabaseClient();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data, error } = await supabase.auth.getSessionFromUrl({
                storeSession: true,
            });

            if (error) {
                console.error('Error handling auth callback:', error);
            } else {
                router.push('/');
            }
        };

        handleAuthCallback();
    }, [router, supabase]);

    return <div>Loading...</div>;
};

export default AuthCallback;