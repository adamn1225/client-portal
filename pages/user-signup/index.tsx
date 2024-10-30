import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import UserLayout from '../components/UserLayout';
import { UserProvider } from '@/context/UserContext';
import SignUpPage from '@/components/UserSignUp';

const SignUpUser: React.FC = () => {

    return (
        <>
            <SignUpPage />
        </>
    );
};

export default SignUpUser;