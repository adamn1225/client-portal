import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Move3d } from 'lucide-react';

export default function ProfileSetup() {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const { email } = router.query;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!email) {
            router.push('/user/signup');
        }
    }, [email, router]);

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error: userError } = await supabase.auth.signInWithPassword({
            email: email as string,
            password: 'your-temporary-password', // Use a temporary password or handle this securely
        });

        if (userError) {
            setError(userError.message);
            setLoading(false);
            return;
        }

        const user = data.user;
        const session = data.session;

        if (user && session) {
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
                    email: session.user.email,
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName,
                    company_size: companySize,
                    company_id: companyId,
                    role: 'user', // Provide a default role
                });

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }

            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Complete Profile</title>
                <meta name="description" content="Complete your profile" />
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
                                    Complete Profile
                                </span>
                                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                                {success ? (
                                    <div className="text-green-500 text-center mb-4 border border-slate-900 p-4 rounded">
                                        Your profile has been completed successfully!
                                    </div>
                                ) : (
                                    <form className="mt-4" onSubmit={handleCompleteProfile}>
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
                                        <button
                                            type="submit"
                                            className="w-full light-dark-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Completing Profile...' : 'Complete Profile'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}