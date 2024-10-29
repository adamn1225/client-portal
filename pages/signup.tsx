// signup.tsx
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { sendInvitations } from '@/lib/invitationService'; // Adjust the path as needed
import { Move3d } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
    const supabase = useSupabaseClient();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [email, setEmail] = useState('');
    const [inviteOthers, setInviteOthers] = useState(false);
    const [inviteEmails, setInviteEmails] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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

        // Check if the email is already registered
        const { data: existingUser, error: existingUserError } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') {
            setError('Error checking existing user');
            setLoading(false);
            return;
        }

        if (existingUser) {
            setError('Email is already registered');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        if (user) {
            // Check if the company already exists
            const { data: existingCompany, error: companyError } = await supabase
                .from('companies')
                .select('id')
                .eq('name', companyName)
                .single();

            let companyId;

            if (companyError && companyError.code !== 'PGRST116') { // PGRST116 is the code for no rows returned
                setError(companyError.message);
                setLoading(false);
                return;
            }

            if (existingCompany) {
                companyId = existingCompany.id;
            } else {
                // Create a new company record
                const { data: newCompany, error: newCompanyError } = await supabase
                    .from('companies')
                    .insert({
                        name: companyName,
                        size: companySize,
                    })
                    .select()
                    .single();

                if (newCompanyError) {
                    setError(newCompanyError.message);
                    setLoading(false);
                    return;
                }

                companyId = newCompany.id;
            }

            // Store additional user information in the profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName,
                    company_size: companySize,
                    company_id: companyId,
                });

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }

            // Send invitations if inviteOthers is true
            if (inviteOthers && inviteEmails) {
                const emails = inviteEmails.split(',').map(email => email.trim());
                await sendInvitations(emails, user.id, companyId);
            }

            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Sign Up</title>
                <meta name="description" content="Sign up for an account" />
            </Head>
            <div className="min-h-screen h-full bg-200">
                <div className="sm::grid-rows-2 min-w-full min-h-screen grid md:grid-cols-2 ">

                    <div className="h-1/3 w-full md:h-full col-span-1 bg-gray-900">
                        <div className='absolute top-5 left-5'>
                            <h1 className='text-stone-100 font-medium text-3xl flex gap-2 items-center'><Move3d /> SSTA Inc</h1>
                        </div>
                        <div className='hidden h-5/6 w-full md:flex items-end justify-center'>
                            <h1 className='text-stone-100 font-medium text-xl italic'>Inventory Management. Procurement. Logistics.</h1>
                        </div>
                    </div>
                
                <div className='col-span-1 flex justify-center items-center'>
                    <div className="w-full max-w-md bg-white shadow-md rounded">
                        <div className="sm:w-2/5 md:w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col  text-base">
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
                                >
                                    <option value="">Select Company Size</option>
                                    <option value="1-10">1-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="201-500">201-500</option>
                                    <option value="501-1000">501-1000</option>
                                    <option value="1001+">1001+</option>
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
                                <div className='flex gap-1 items-center'>
                                    <label htmlFor="inviteOthers" className="mt-3">Invite Others</label>
                                    <input
                                        type="checkbox"
                                        id="inviteOthers"
                                        checked={inviteOthers}
                                        onChange={(e) => setInviteOthers(e.target.checked)}
                                        className="mt-2"
                                        disabled={loading}
                                    />
                                </div>
                                {inviteOthers && (
                                    <div className="mt-4">
                                        <label htmlFor="inviteEmails">Invite Emails (comma separated)</label>
                                        <textarea
                                            id="inviteEmails"
                                            value={inviteEmails}
                                            onChange={(e) => setInviteEmails(e.target.value)}
                                            className="w-full p-2 mt-2 border rounded"
                                            disabled={loading}
                                        />
                                    </div>
                                )}

                                    <div className="mt-4 text-center">
                                        <p>Already have an account?</p>
                                        <Link href="/signup" legacyBehavior>
                                            <a className="text-blue-900 underline font-semibold">Login</a>
                                        </Link>
                                    </div>
                                <button
                                    type="submit"
                                    className="w-full p-2 mt-4 bg-gray-900 text-stone-100 rounded"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </form>
                        </div>
                        </div>
                </div>
                </div>
            </div>
        </>
    );
}