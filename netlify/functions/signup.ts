import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { EventEmitter } from 'events';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL and Service Role Key must be set in environment variables');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Increase the limit of listeners
EventEmitter.defaultMaxListeners = 20;

export const handler: Handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body as string);

        // Validate input data
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email and password are required' }),
            };
        }

        // Sign up the user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('Supabase Auth Error:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Sign up successful! Please check your email to confirm your account.' }),
        };
    } catch (error) {
        console.error('Unexpected Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An unexpected error occurred.' }),
        };
    }
};