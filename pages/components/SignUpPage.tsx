import { useState } from 'react';
import Layout from './Layout';
import Head from 'next/head';

export default function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const apiUrl = isLocal
            ? 'http://localhost:8888/.netlify/functions/signup'
            : '/.netlify/functions/signup';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    companyName,
                    companySize,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                setError(result.error);
                setLoading(false);
                return;
            }

            setSuccess(true);
        } catch (error) {
            setError('An unexpected error occurred. Please try again later.');
            console.error('SignUp Error:', error);
        } finally {
            setLoading(false);
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
                    <div className="xs:w-2/5 md:w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col text-base">
                        <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                            Sign Up
                        </span>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        {success && <div className="text-green-500 text-center mb-4">Sign up successful! Please check your email to confirm your account.</div>}
                        <form className="mt-4" onSubmit={handleSignUp}>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <label htmlFor="lastName" className="mt-4">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <label htmlFor="companyName" className="mt-4">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <label htmlFor="companySize" className="mt-4">Company Size</label>
                            <select
                                id="companySize"
                                value={companySize}
                                onChange={(e) => setCompanySize(e.target.value)}
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                                required
                            >
                                <option value="">Select Company Size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="501-1000">501-1000 employees</option>
                                <option value="1001-5000">1001-5000 employees</option>
                                <option value="5001-10000">5001-10000 employees</option>
                                <option value="10001+">10001+ employees</option>
                            </select>
                            <label htmlFor="email" className="mt-4">Email</label>
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
                            <label htmlFor="confirmPassword" className="mt-4">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-2 mt-2 border rounded"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="w-full p-2 mt-4 bg-blue-500 text-white rounded"
                                disabled={loading}
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}