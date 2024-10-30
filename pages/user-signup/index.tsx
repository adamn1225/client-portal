import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Layout from '../components/Layout';
import { UserProvider } from '@/context/UserContext';
import SignUpPage from '../components/SignUpPage';

const SignUpUser: React.FC = () => {
    const session = useSession();

    return (
        <UserProvider>
            <Layout>
                <SignUpPage />
            </Layout>
        </UserProvider>
    );
};

export default SignUpUser;