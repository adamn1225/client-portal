// dataFetching.ts
import { supabase } from './initSupabase'; // Adjust the import path as needed

export const fetchData = async () => {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
        return [];
    } else {
        console.log('Data:', data);
        return data;
    }
};