import { supabase } from './initSupabase';

// Function to get tasks due now
export async function getTasksDueNow() {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const currentTime = now.toTimeString().split(' ')[0]; // Get current time in HH:MM:SS format

    const { data, error } = await supabase
        .from('freight')
        .select('*')
        .eq('due_date', today)
        .eq('reminder_time', currentTime)
        .is('is_complete', false);

    if (error) {
        console.error('Error fetching due tasks:', error);
        return [];
    }

    return data;
}

// Function to get all shipping quotes for a user
export async function getShippingQuotes(userId: string) {
    const { data, error } = await supabase
        .from('shippingquotes') // Ensure the table name matches
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching shipping quotes:', error);
        return [];
    }

    return data;
}

// Function to add a new shipping quote
export async function addShippingQuote(quote: {
    user_id: string;
    due_date: string;
    origin_city: string;
    origin_state: string;
    origin_zip: string;
    destination_city: string;
    destination_state: string;
    destination_zip: string;
}) {
    const { data, error } = await supabase
        .from('shippingquotes') // Ensure the table name matches
        .insert([quote])
        .select();

    if (error) {
        console.error('Error adding shipping quote:', error);
        return null;
    }

    return data;
}

// Function to delete a shipping quote
export async function deleteShippingQuote(id: number) {
    const { error } = await supabase
        .from('shippingquotes') // Ensure the table name matches
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting shipping quote:', error);
        return false;
    }

    return true;
}

// Function to fetch all users
export async function fetchAllUsers() {
    // Fetch users from the profiles table
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name')
        .eq('role', 'user');

    if (profilesError) {
        console.error('Error fetching users from profiles:', profilesError);
        return [];
    }

    console.log('Profiles Data:', profilesData); // Add this line

    return profilesData;
}

// Function to fetch all quotes
export async function fetchAllQuotes() {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select('*');

    if (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }

    return data;
}