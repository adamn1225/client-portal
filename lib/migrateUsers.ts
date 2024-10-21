import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/schema';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client with anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''; // Ensure this is set in your environment variables

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

const migrateExistingUsers = async () => {
    // Fetch existing users from the profiles table
    const { data: authUsers, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email');

    if (fetchError) {
        console.error('Error fetching existing users:', fetchError.message);
        return;
    }

    // Insert or update existing users in the custom profiles table
    for (const authUser of authUsers) {
        const { id, email } = authUser;

        // Check if the user already exists in the custom profiles table
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles') // Changed from 'users' to 'profiles'
            .select('id')
            .eq('id', id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the code for no rows returned
            console.error(`Error checking user ${id}:`, checkError.message);
            continue;
        }

        if (existingUser) {
            // Update the existing user's profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    email: email ?? '',
                    role: 'user', // Default role
                    first_name: null,
                    last_name: null,
                    company_name: null,
                    profile_picture: null,
                    address: null,
                    phone_number: null, // Ensure phone_number is included
                })
                .eq('id', id);

            if (updateError) {
                console.error(`Error updating user ${id}:`, updateError.message);
            } else {
                console.log(`User ${id} updated successfully.`);
            }
        } else {
            // Insert the new user into the profiles table
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id,
                    email: email ?? '',
                    role: 'user', // Default role
                    inserted_at: new Date().toISOString(),
                    first_name: null,
                    last_name: null,
                    company_name: null,
                    profile_picture: null,
                    address: null,
                    phone_number: null, // Ensure phone_number is included
                });

            if (insertError) {
                console.error(`Error inserting user ${id}:`, insertError.message);
            } else {
                console.log(`User ${id} inserted successfully.`);
            }
        }
    }
};

migrateExistingUsers();