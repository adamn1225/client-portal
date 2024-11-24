import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { sendInvitations } from '@/lib/invitationService'; // Adjust the import path as needed
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

const ProfileSetup = () => {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const session = useSession();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // Add phone number state
    const [inviteEmails, setInviteEmails] = useState<{ email: string, role: 'manager' | 'member' }[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'manager' | 'member'>('member');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState(''); // Add email state

    useEffect(() => {
        const fetchUserEmail = async () => {
            if (session?.user?.id) {
                const { data, error } = await supabase
                    .from('auth.users')
                    .select('email')
                    .eq('id', session.user.id)
                    .single();

                if (error) {
                    setError(error.message);
                } else {
                    setEmail(data.email);
                }
            }
        };

        fetchUserEmail();
    }, [session, supabase]);

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Ensure the company exists or create a new one
            let companyId: string;
            if (companyName) {
                const { data: existingCompany, error: companyError } = await supabase
                    .from('companies')
                    .select('id')
                    .eq('name', companyName)
                    .single();

                if (companyError && companyError.code !== 'PGRST116') {
                    throw new Error(companyError.message);
                }

                if (existingCompany) {
                    companyId = existingCompany.id;
                } else {
                    const { data: newCompany, error: newCompanyError } = await supabase
                        .from('companies')
                        .insert({
                            name: companyName,
                        })
                        .select()
                        .single();

                    if (newCompanyError) {
                        throw new Error(newCompanyError.message);
                    }

                    companyId = newCompany.id;
                }
            } else {
                companyId = uuidv4();
            }

            const { error } = await supabase
                .from('profiles')
                .insert({
                    id: session?.user?.id,
                    email: email, // Use the email fetched from auth.users
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName || `${firstName} ${lastName}`,
                    phone_number: phoneNumber, // Include phone number
                    company_id: companyId,
                    profile_complete: true, // Set profile_complete to true
                    role: 'manager', // Set team_role to manager
                });

            if (error) {
                throw new Error(error.message);
            }

            // Store invitations with roles and add invited users to the companies table
            for (const invite of inviteEmails) {
                const { error: inviteError } = await supabase
                    .from('invitations')
                    .insert({
                        email: invite.email,
                        team_role: invite.role,
                        company_id: companyId,
                    });

                if (inviteError) {
                    throw new Error(inviteError.message);
                }
            }

            setSuccess(true);
            router.push('/user');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInviteEmail = () => {
        if (inviteEmail && !inviteEmails.some(invite => invite.email === inviteEmail)) {
            setInviteEmails([...inviteEmails, { email: inviteEmail, role: inviteRole }]);
            setInviteEmail('');
        }
    };

    const handleSendInvitations = async () => {
        if (session?.user?.id && companyName) {
            const inviteEmailAddresses = inviteEmails.map(invite => invite.email);
            await sendInvitations(inviteEmailAddresses, session.user.id, companyName);
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
                                        <label htmlFor="phoneNumber" className="mt-4">Phone Number</label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full p-2 mt-2 border rounded"
                                            disabled={loading}
                                        />
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-center">Invite Your Team!</h3>
                                            <div className="flex mt-4">
                                                <input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    className="w-full p-2 border rounded"
                                                />
                                                <select
                                                    value={inviteRole}
                                                    onChange={(e) => setInviteRole(e.target.value as 'manager' | 'member')}
                                                    className="ml-2 p-2 border rounded"
                                                >
                                                    <option value="manager">Manager</option>
                                                    <option value="member">Member</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={handleAddInviteEmail}
                                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <ul className="mt-4">
                                                {inviteEmails.map((invite, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        <span>{invite.email} ({invite.role})</span>
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