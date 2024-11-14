import { supabase } from './initSupabase'; // Adjust the import path as needed

export const isProfileComplete = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, company_name, company_size')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error.message);
        return false;
    }

    const { first_name, last_name, company_name, company_size } = data;
    return first_name && last_name && company_name && company_size;
};