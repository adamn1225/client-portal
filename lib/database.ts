import { createClient } from '@supabase/supabase-js';
import { Database, MaintenanceItem } from '@/lib/schema';
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

export async function fetchMaintenanceItems(userId: string): Promise<MaintenanceItem[]> {
    const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching maintenance items:', error);
        return [];
    }

    return data as MaintenanceItem[];
}

export async function addMaintenanceItem(item: Omit<MaintenanceItem, 'created_at'>): Promise<MaintenanceItem | null> {
    const { data, error } = await supabase
        .from('maintenance')
        .insert([{
            ...item,
            schedule_date: item.schedule_date || null // Ensure schedule_date is null if empty
        }])
        .select();

    if (error) {
        console.error('Error adding maintenance item:', error);
        return null;
    }

    return data[0] as MaintenanceItem;
}