// migrateUsers.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/schema';

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''; // Ensure this is set in your environment variables
const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

const migrateExistingUsers = async () => {
    // Fetch existing users from the auth.users table using the Admin API
    const { data, error: fetchError } = await supabase.auth.admin.listUsers();

    if (fetchError) {
        console.error('Error fetching existing users:', fetchError.message);
        return;
    }

    const authUsers = data.users; // Access the users property

    // Insert existing users into the custom profiles table
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
            console.log(`User ${id} already exists. Skipping insertion.`);
            continue;
        }

        const { error: insertError } = await supabase
            .from('profiles') // Changed from 'users' to 'profiles'
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
            });

        if (insertError) {
            console.error(`Error inserting user ${id}:`, insertError.message);
        } else {
            console.log(`User ${id} inserted successfully.`);
        }
    }
};

migrateExistingUsers();