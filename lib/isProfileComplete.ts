import { supabase } from './initSupabase'; // Adjust the import path as needed
import { Profile } from '@/lib/schema';

export const isProfileComplete = async (userId: string): Promise<boolean> => {
    console.log('Checking profile completeness for user:', userId);
    const { data, error } = await supabase
        .from('profiles')
        .select('profile_complete')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.error('Error fetching profile:', error?.message);
        return false;
    }

    const { profile_complete } = data;
    console.log('Profile completeness:', profile_complete);
    return profile_complete;
};