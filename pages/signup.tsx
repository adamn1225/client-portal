import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from './components/Layout'; // Adjust the import path as needed
import { Database } from '@/lib/schema';

const SignUp = () => {
    const supabase = useSupabaseClient<Database>();
    const router = useRouter();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            const user = data.user;
            if (user) {
                console.log('User ID:', user.id); // Log the user ID
                const userEmail = user.email ?? ''; // Provide a default value for email
                const { error: profileError } = await supabase
                    .from('profiles') // Ensure the table name is correct
                    .insert({
                        id: user.id, // Ensure the user ID is correctly passed
                        email: userEmail, // Ensure the email is correctly passed
                        first_name: firstName,
                        last_name: lastName,
                        role: 'user', // Ensure the role is set
                        company_name: null, // Ensure all new fields are included
                        address: null,
                        phone_number: null,
                        profile_picture: null,
                        inserted_at: new Date().toISOString(), // Ensure inserted_at is set
                    });

                if (profileError) {
                    console.error('Profile Error:', profileError); // Log the profile error
                    setError(profileError.message);
                } else {
                    setError(null);
                    router.push('/login'); // Redirect to login page after successful sign-up
                }
            }
        }
    };

    return (
        <Layout>
            <Head>
                <title>Sign Up</title>
                <meta name="description" content="Sign up for an account" />
            </Head>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md bg-white shadow-md rounded">
                    <h2 className="text-2xl font-bold text-center">NTS Portal</h2>
                    <div className="xs:w-2/5 w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col text-base">
                        <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                            Sign Up
                        </span>
                        <form className="mt-4" onSubmit={handleSignUp}>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                            />
                            <label htmlFor="lastName" className="mt-4">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                            />
                            <label htmlFor="email" className="mt-4">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                            />
                            <label htmlFor="password" className="mt-4">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                            />
                            <button type="submit" className="btn-black w-full mt-4">
                                Sign Up
                            </button>
                        </form>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SignUp;