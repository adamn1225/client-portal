import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const CustomSignInForm = () => {
    const supabase = useSupabaseClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
        } else {
            setError(null);
        }
    };

    return (
        <form onSubmit={handleSignIn}>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 border border-zinc-300 rounded w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 p-2 border border-zinc-300 rounded w-full"
                    required
                />
            </div>
            <button type="submit" className="flex jusitfy-center w-full">
                <span className='body-btn text-center w-full'>Sign In</span>
            </button>
        </form>
    );
};

export default CustomSignInForm;