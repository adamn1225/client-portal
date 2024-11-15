import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { sendInvitations } from '@/lib/invitationService'; // Adjust the import path as needed

const ProfileSetup = () => {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const session = useSession();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (session?.user?.id) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error.message);
                } else if (data) {
                    setFirstName(data.first_name || '');
                    setLastName(data.last_name || '');
                    setCompanyName(data.company_name || '');
                    setCompanySize(data.company_size || '');
                }
            }
        };

        fetchProfile();
    }, [session, supabase]);

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: session?.user?.id,
                    email: session?.user?.email,
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName,
                    company_size: companySize,
                    profile_complete: true, // Set profile_complete to true
                });

            if (error) {
                throw new Error(error.message);
            }

            setSuccess(true);
            router.push('/user/freight-rfq');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInviteEmail = () => {
        if (inviteEmail && !inviteEmails.includes(inviteEmail)) {
            setInviteEmails([...inviteEmails, inviteEmail]);
            setInviteEmail('');
        }
    };

    const handleSendInvitations = async () => {
        if (session?.user?.id && companyName) {
            await sendInvitations(inviteEmails, session.user.id, companyName);
            setInviteEmails([]);
        }
    };

    return (
        <>
            <Head>
                <title>Complete Profile</title>
                <meta name="description" content="Complete your profile" />
            </Head>
            <div className="w-full h-full bg-200">
                <div className="md:grid min-w-full min-h-screen md:grid-cols-1 ">
                    <div className="sm:row-span-1 md:col-span-1 w-full h-full flex flex-col justify-center items-center bg-zinc-100">
                        <div className=" w-full text-zinc-900 h-full sm:h-auto sm:w-full max-w-md p-5 bg-white shadow flex flex-col justify-center items-center text-base">
                            <h2 className="mt-12 md:mt-0 text-2xl font-bold text-center">SHIPPER CONNECT</h2>
                            <div className="xs:w-2/5 md:w-full h-full sm:h-auto p-5 bg-white shadow flex flex-col text-base">
                                <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                                    Complete Profile
                                </span>
                                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                                {success ? (
                                    <div className="text-green-500 text-center mb-4 border border-zinc-900 p-4 rounded">
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
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-center">Invite Others</h3>
                                            <div className="flex mt-4">
                                                <input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    className="w-full p-2 border rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddInviteEmail}
                                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <ul className="mt-4">
                                                {inviteEmails.map((email, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        <span>{email}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                type="button"
                                                onClick={handleSendInvitations}
                                                className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded"
                                            >
                                                Send Invitations
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full body-btn mt-8"
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

export default ProfileSetup;