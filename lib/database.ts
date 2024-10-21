import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/schema';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function fetchAllQuotes() {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select('*');

    if (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }

    console.log('Fetched Quotes:', data); // Add this line for debugging

    return data;
}

export async function fetchAllUsers() {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select('user_id, first_name, last_name, email');

    if (error) {
        console.error('Error fetching users from shippingquotes:', error);
        return [];
    }

    // Extract unique users
    const uniqueUsers = data.reduce((acc: any, quote: any) => {
        if (!acc.some((quote: any) => quote.user_id === quote.user_id)) {
            acc.push({
                user_id: quote.user_id,
                first_name: quote.first_name,
                last_name: quote.last_name,
                email: quote.email,
            });
        }
        return acc;
    }, []);

    console.log('Fetched Users:', uniqueUsers); // Add this line for debugging

    return uniqueUsers;
}