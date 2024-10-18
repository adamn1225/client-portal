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

    // Insert existing users into the custom users table
    for (const authUser of authUsers) {
        const { id, email } = authUser;
        const { error: insertError } = await supabase
            .from('users')
            .insert({
                id,
                email: email ?? '',
                first_name: null, // Set default values for first_name and last_name
                last_name: null,
                company_name: null, // Ensure all new fields are included
                address: null,
                phone_number: null,
                profile_picture: null,
                inserted_at: new Date().toISOString(),
            });

        if (insertError) {
            console.error(`Error inserting user ${id}:`, insertError.message);
        } else {
            console.log(`User ${id} inserted successfully.`);
        }
    }
};

migrateExistingUsers();