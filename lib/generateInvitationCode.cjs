// generateInvitationCode.cjs
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateInvitationCode = async () => {
    const code = Math.random().toString(36).substring(2, 15); // Generate a random code
    const { data, error } = await supabase
        .from('invitation_codes')
        .insert({ code })
        .select(); // Ensure the inserted data is returned

    if (error) {
        console.error('Error generating invitation code:', error.message, error.details, error.hint);
    } else {
        console.log('Invitation code generated:', data);
    }
};

generateInvitationCode();