// invitationService.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const sendInvitations = async (emails: string[], userId: string, companyId: string) => {
    for (const email of emails) {
        const token = uuidv4(); // Generate a unique token

        // Store the invitation token in the database
        await supabase
            .from('invitations')
            .insert({
                email,
                token,
                invited_by: userId,
                company_id: companyId,
            });

        // Send the invitation email with the unique link
        const invitationLink = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/invite?token=${token}`;
        await fetch('/api/sendInviteEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                subject: 'Invitation to join NTS Portal',
                text: `You have been invited to join NTS Portal. Please sign up using the following link: ${invitationLink}`,
            }),
        });
    }
};