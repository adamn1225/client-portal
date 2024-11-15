import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';
import { isProfileComplete } from '@/lib/isProfileComplete';
import { NextComponentType, NextPageContext } from 'next';

const withProfileCheck = (WrappedComponent: NextComponentType<NextPageContext, any, any>) => {
    const ComponentWithProfileCheck = (props: any) => {
        const router = useRouter();
        const session = useSession();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkProfile = async () => {
                if (session?.user?.id) {
                    console.log('Session user ID:', session.user.id);
                    const profileComplete = await isProfileComplete(session.user.id);
                    if (!profileComplete && router.pathname !== '/profile-setup') {
                        console.log('Profile incomplete, redirecting to profile setup');
                        router.push('/profile-setup');
                    } else {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            };

            checkProfile();
        }, [session, router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return ComponentWithProfileCheck;
};

export default withProfileCheck;