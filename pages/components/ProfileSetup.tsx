import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Move3d } from 'lucide-react';
import { sendInvitations } from '@/lib/invitationService'; // Adjust the import path as needed

const ProfileSetup = () => {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const session = useSession();
    const { email } = router.query;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName,
                    company_size: companySize,
                })
                .eq('email', email);

            if (error) {
                throw new Error(error.message);
            }

            setSuccess(true);
            router.push('/user/dashboard');
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
                            <h2 className="mt-12 md:mt-0 text-2xl font-bold text-center">Heavy Construct</h2>
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
                                        <button
                                            type="submit"
                                            className="w-full body-btn-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Completing Profile...' : 'Complete Profile'}
                                        </button>
                                    </form>
                                )}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileSetup;