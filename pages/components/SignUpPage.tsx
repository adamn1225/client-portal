import { useRouter } from 'next/router';
import { useState } from 'react';
import { createClient } from '@/lib/client';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function logIn() {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }
        router.push('/');
    }

    async function signUp() {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }
        router.push('/');
    }

    return (
        <Layout>
            <Head>
                <title>Login / Sign Up</title>
                <meta name="description" content="Login or sign up for an account" />
            </Head>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md bg-white shadow-md rounded">
                    <h2 className="text-2xl font-bold text-center">NTS Portal</h2>
                    <div className="xs:w-2/5 md:w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col text-base">
                        <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                            Login / Sign Up
                        </span>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        <form className="mt-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <label htmlFor="password" className="mt-4">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={logIn}
                                    className="w-full p-2 mt-4 bg-blue-500 text-white rounded mr-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging In...' : 'Log In'}
                                </button>
                                <button
                                    type="button"
                                    onClick={signUp}
                                    className="w-full p-2 mt-4 bg-green-500 text-white rounded ml-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}