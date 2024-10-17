import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Database } from '@/lib/schema';

const SignUp = () => {
    const supabase = useSupabaseClient<Database>();
    const router = useRouter();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [confirmationSent, setConfirmationSent] = useState<boolean>(false);

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
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                        id: user.id, // Ensure the user ID is correctly passed
                        email: user.email, // Ensure the email is correctly passed
                        first_name: firstName,
                        last_name: lastName,
                        inserted_at: new Date().toISOString(), // Ensure inserted_at is set
                    });

                if (profileError) {
                    console.error('Profile Error:', profileError); // Log the profile error
                    setError(profileError.message);
                } else {
                    setError(null);
                    setConfirmationSent(true); // Set confirmation sent state
                }
            }
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {confirmationSent ? (
                <div className="p-4 border border-slate-900 rounded">
                    <h2 className="text-xl font-bold">Confirmation Email Sent</h2>
                    <p>A confirmation link was sent to {email}. Please check your email to complete the sign-up process.</p>
                </div>
            ) : (
                <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-slate-900"
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-slate-900"
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-slate-900"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-slate-900"
                        />
                    </div>
                    <button type="submit" className="btn-slate">
                        Sign Up
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default SignUp;