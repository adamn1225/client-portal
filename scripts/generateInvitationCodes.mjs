import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const generateInvitationCode = () => {
    return nanoid(10); // Generate a 10-character unique code
};

const generateInvitationCodes = async (numCodes) => {
    try {
        const codes = Array.from({ length: numCodes }, () => ({
            code: generateInvitationCode(),
            is_used: false,
        }));

        const { data, error } = await supabase
            .from('invitation_codes')
            .insert(codes)
            .select();

        if (error) {
            throw new Error(`Error inserting invitation codes: ${error.message}`);
        }

        console.log('Generated Invitation Codes:', data);
    } catch (error) {
        console.error('Error generating invitation codes:', error.message);
    }
};

const numCodes = 5; // Number of codes to generate
generateInvitationCodes(numCodes);