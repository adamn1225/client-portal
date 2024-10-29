// lib/analytics.ts
import { supabase } from './database';

const getStartDate = (period: string) => {
    const now = new Date();
    switch (period) {
        case 'day':
            return new Date(now.setDate(now.getDate() - 1)).toISOString();
        case 'week':
            return new Date(now.setDate(now.getDate() - 7)).toISOString();
        case 'month':
            return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        case '3months':
            return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
        default:
            return new Date(0).toISOString();
    }
};

export const fetchSignups = async (period: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, inserted_at')
        .gte('inserted_at', getStartDate(period));

    if (error) {
        console.error('Error fetching signups:', error);
        return [];
    }

    return data;
};

export const fetchQuoteRequests = async (period: string) => {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select('id, inserted_at')
        .gte('inserted_at', getStartDate(period));

    if (error) {
        console.error('Error fetching quote requests:', error);
        return [];
    }

    return data;
};

export const fetchUsageStats = async (period: string) => {
    const { data, error } = await supabase
        .from('usage_stats')
        .select('id, login_count, active_time')
        .gte('created_at', getStartDate(period));

    if (error) {
        console.error('Error fetching usage stats:', error);
        return [];
    }

    return data;
};