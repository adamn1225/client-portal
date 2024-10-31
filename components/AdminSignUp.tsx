// components/AdminSignUp.tsx
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../pages/components/Layout';
import Head from 'next/head';

export function AdminSignUp() {
    const supabase = useSupabaseClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invitationCode, setInvitationCode] = useState('');
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

        // Validate invitation code
        const { data: validCode, error: codeError } = await supabase
            .from('invitation_codes')
            .select('code')
            .eq('code', invitationCode)
            .eq('is_used', false)
            .single();

        if (codeError || !validCode) {
            setError('Invalid or already used invitation code');
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
            // Store additional user information in the profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    role: 'admin', // Grant admin role
                });

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }

            // Mark the invitation code as used
            await supabase
                .from('invitation_codes')
                .update({ is_used: true })
                .eq('code', invitationCode);

            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <></>
    )
}

export default AdminSignUp
