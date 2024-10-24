import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/schema';
import dotenv from 'dotenv';
import { MaintenanceItem } from '@/lib/types';
import MaintenanceTab from '@/components/inventory/MaintenanceTab';

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

export async function fetchMaintenanceItems(userId: string) {
    const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching maintenance items:', error);
        return [];
    }

    return data;
}



export async function addMaintenanceItem(item: Omit<MaintenanceItem, 'id' | 'created_at'>): Promise<any> {
    try {
        // Fetch the authenticated user to get the user_id
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error fetching authenticated user:', userError);
            throw userError;
        }

        if (!user || !user.user) {
            console.error('User is not authenticated');
            throw new Error('User not authenticated');
        }

        // Insert the maintenance item with the user_id
        const { data, error } = await supabase
            .from('maintenance')
            .insert([{
                ...item,
                user_id: user.user.id, // Use authenticated user's UUID
                schedule_date: item.schedule_date || null // Handle optional schedule_date
            }])
            .select(); // Return the inserted item

        // Handle any errors during the insert operation
        if (error) {
            console.error('Error adding maintenance item:', error);
            throw error; // Re-throw the error for the caller to handle
        }

        return data[0]; // Return the first inserted maintenance item
    } catch (error) {
        console.error('Error in addMaintenanceItem:', error);
        throw error; // Ensure errors are propagated
    }
}



export async function fetchFreightData(freightId: number) {
    const { data, error } = await supabase
        .from('freight')
        .select('*')
        .eq('id', freightId)
        .single();

    if (error) {
        console.error('Error fetching freight data:', error);
        return null;
    }

    return data;
}