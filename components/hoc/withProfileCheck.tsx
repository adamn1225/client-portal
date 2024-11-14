import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';
import { isProfileComplete } from '@/lib/isProfileComplete'; // Adjust the import path as needed
import { NextComponentType, NextPageContext } from 'next';

const withProfileCheck = (WrappedComponent: NextComponentType<NextPageContext, any, any>) => {
    const ComponentWithProfileCheck = (props: any) => {
        const router = useRouter();
        const session = useSession();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkProfile = async () => {
                if (session?.user?.id) {
                    const profileComplete = await isProfileComplete(session.user.id);
                    if (!profileComplete && router.pathname !== '/profile-setup') {
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

    ComponentWithProfileCheck.getInitialProps = async (context: NextPageContext) => {
        if (WrappedComponent.getInitialProps) {
            return WrappedComponent.getInitialProps(context);
        }
        return {};
    };

    return ComponentWithProfileCheck;
};

export default withProfileCheck;