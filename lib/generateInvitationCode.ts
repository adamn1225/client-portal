// generateInvitationCode.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateInvitationCode = async () => {
    const code = Math.random().toString(36).substring(2, 15); // Generate a random code
    const { data, error } = await supabase
        .from('invitation_codes')
        .insert({ code });

    if (error) {
        console.error('Error generating invitation code:', error.message);
    } else {
        console.log('Invitation code generated:', data);
    }
};

generateInvitationCode();