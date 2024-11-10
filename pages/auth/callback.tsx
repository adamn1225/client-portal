import { GetServerSideProps } from 'next';
import { supabase } from '@/lib/initSupabase'; 

const AuthCallback = () => {
    return <div>Loading...</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error handling auth callback:', error);
        return {
            redirect: {
                destination: '/error',
                permanent: false,
            },
        };
    }

    return {
        redirect: {
            destination: '/', 
            permanent: false,
        },
    };
};

export default AuthCallback;