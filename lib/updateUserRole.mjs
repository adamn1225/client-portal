import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export const updateUserRole = async (email, newRole) => {
    try {
        // Check if the user exists
        const { data: user, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (userError) {
            throw new Error(`User not found: ${userError.message}`);
        }

        console.log('User found:', user);

        // Update the user's role
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('email', email)
            .select();

        if (error) {
            throw new Error(`Error updating user role: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error updating user role:', error.message);
        throw error;
    }
};