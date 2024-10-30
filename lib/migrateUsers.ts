import { supabase } from '@lib/database'; // Use the centralized client
import dotenv from 'dotenv';

dotenv.config();

const migrateExistingUsers = async () => {
    // Fetch existing users from the profiles table
    const { data: authUsers, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email')
        .returns<{ id: string; email: string }[]>(); // Explicitly define the type here

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
            .single<{ id: string }>(); // Explicitly define the type here

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the code for no rows returned
            console.error(`Error checking user ${id}:`, checkError.message);
            continue;
        }

        // Insert or update the user in the custom profiles table
        if (!existingUser) {
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({ id, email, role: 'user' }); // Add the required 'role' property

            if (insertError) {
                console.error(`Error inserting user ${id}:`, insertError.message);
            }
        } else {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ email })
                .eq('id', id);

            if (updateError) {
                console.error(`Error updating user ${id}:`, updateError.message);
            }
        }
    }
};

migrateExistingUsers();