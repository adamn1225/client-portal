// lib/database.ts

import { supabase } from './initSupabase';

// Function to fetch all users
export async function fetchAllUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, company_name, profile_picture, address, phone_number, role, inserted_at');

    if (error) {
        console.error('Error fetching users from profiles:', error);
        return [];
    }

    console.log('Fetched Users:', data); // Add this line for debugging

    return data;
}

// Function to fetch all quotes with user details
export async function fetchAllQuotesWithUserDetails() {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select(`
            *,
            profiles (
                id,
                email,
                first_name,
                last_name
            )
        `);

    if (error) {
        console.error('Error fetching quotes with user details:', error);
        return [];
    }

    console.log('Fetched Quotes with User Details:', data); // Add this line for debugging

    return data;
}