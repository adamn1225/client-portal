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
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        first_name: firstName,
                        last_name: lastName,
                    });

                if (profileError) {
                    setError(profileError.message);
                } else {
                    setError(null);
                    router.push('/login'); // Redirect to login page after successful sign-up
                }
            }
        }
    };

    return (
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
    );
};

export default SignUp;