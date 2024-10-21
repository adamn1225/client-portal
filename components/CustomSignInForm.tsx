import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React from 'react';

export default function CustomSignInForm() {
    const supabase = useSupabaseClient();

    const handleSignInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/auth/callback'
                    : 'https://your-production-url.com/auth/callback',
            },
        });
        if (error) {
            console.log('Error signing in with Google:', error.message);
        }
    };

    const handleSignInWithEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = (event.target as HTMLFormElement).email.value;
        const password = (event.target as HTMLFormElement).password.value;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.log('Error signing in with email:', error.message);
        }
    };

    return (
        <div>
            <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
            <form onSubmit={handleSignInWithEmail}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Sign in with Email</button>
            </form>
        </div>
    );
}