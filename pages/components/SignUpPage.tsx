import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Link from 'next/link';
import { Move3d } from 'lucide-react';

export default function SignUpPage() {
    const supabase = useSupabaseClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/user/profile-setup`
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        if (user) {
            setSuccess(true);
        }

        setLoading(false);
    };

    const handleResendConfirmation = async () => {
        setResendLoading(true);
        setResendSuccess(false);
        setError(null);

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/user/profile-setup`
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setResendSuccess(true);
        }

        setResendLoading(false);
    };

    return (
        <>
            <Head>
                <title>SSTA - Sign Up</title>
                <meta name="description" content="Sign up for an account" />
            </Head>
            <div className="w-full h-full bg-200">
                <div className="md:grid min-w-full min-h-screen md:grid-cols-2 ">

                    <div className="hidden md:grid h-1/3 w-full md:h-full col-span-1 bg-gray-900">
                        <div className='absolute top-5 left-5'>
                            <h1 className='text-stone-100 font-medium text-3xl flex gap-2 items-center'><Move3d /> SSTA Inc</h1>
                        </div>
                        <div className='hidden h-full pb-12 w-full md:flex items-end justify-center'>
                            <h1 className='text-stone-100 font-medium text-xl italic'>Your trusted partner in Inventory Management, Procurement, and Logistics.</h1>
                        </div>
                    </div>

                    <div className="sm:row-span-1 md:col-span-1 w-full h-full flex flex-col justify-center items-center bg-slate-100">
                        <div className='hidden md:block md:absolute top-5 right-5'>
                            <Link href="/login" legacyBehavior>
                                <a className="light-dark-btn">Login</a>
                            </Link>
                        </div>
                        <div className=" w-full text-gray-900 h-full sm:h-auto sm:w-full max-w-md p-5 bg-white shadow flex flex-col justify-center items-center text-base">
                            <h2 className="mt-12 md:mt-0 text-2xl font-bold text-center">SSTA Inc</h2>
                            <div className="xs:w-2/5 md:w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col text-base">
                                <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                                    Sign Up
                                </span>
                                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                                {success ? (
                                    <div className="text-green-500 text-center mb-4 border border-slate-900 p-4 rounded">
                                        Your sign up was successful! Please check your email to confirm your account. Make sure to check your spam or junk folder if you don&apos;t see it within a few minutes!
                                        <button
                                            onClick={handleResendConfirmation}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                            disabled={resendLoading}
                                        >
                                            {resendLoading ? 'Resending...' : 'Resend Confirmation Email'}
                                        </button>
                                        {resendSuccess && <div className="text-green-500 mt-2">Confirmation email resent successfully!</div>}
                                    </div>
                                ) : (
                                    <form className="mt-4" onSubmit={handleSignUp}>
                                        <label htmlFor="email" className="mt-4">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full p-2 mt-2 border rounded"
                                            disabled={loading}
                                            autoComplete="email"
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
                                            autoComplete="new-password"
                                        />
                                        <label htmlFor="confirmPassword" className="mt-4">Confirm Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full p-2 mt-2 border rounded"
                                            disabled={loading}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full light-dark-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Signing Up...' : 'Sign Up'}
                                        </button>
                                    </form>
                                )}
                                <div className='flex flex-col justify-evenly max-h-max items-center w-full my-4'>
                                    <div className='border-t border-gray-900/40 pt-1 mb-2 w-full text-center'><h3>Already have an account?</h3></div>
                                    <Link href="/login" legacyBehavior>
                                        <a className="text-center text-lg font-semibold text-gray-700 hover:underline underline-offset-2 px-4 py-2 hover:text-slate-900/70">Login</a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}