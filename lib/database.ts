import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import dotenv from 'dotenv';
import { MaintenanceItem, Company, Vendor, PurchaseOrder } from '@/lib/schema';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function fetchAllQuotes() {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select('*');

    if (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }

    console.log('Fetched Quotes:', data); // Add this line for debugging

    return data;
}

export async function fetchAllUsers() {
    const { data, error } = await supabase
        .from('shippingquotes')
        .select('user_id, first_name, last_name, email');

    if (error) {
        console.error('Error fetching users from shippingquotes:', error);
        return [];
    }

    // Extract unique users
    const uniqueUsers = data.reduce((acc: any, quote: any) => {
        if (!acc.some((q: any) => q.user_id === quote.user_id)) {
            acc.push({
                user_id: quote.user_id,
                first_name: quote.first_name,
                last_name: quote.last_name,
                email: quote.email,
            });
        }
        return acc;
    }, []);

    console.log('Fetched Users:', uniqueUsers); // Add this line for debugging

    return uniqueUsers;
}

export async function fetchMaintenanceItems(userId: string) {
    const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching maintenance items:', error);
        return [];
    }

    return data;
}

export async function addMaintenanceItem(item: Omit<MaintenanceItem, 'id' | 'created_at'>): Promise<any> {
    try {
        // Fetch the authenticated user to get the user_id
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error fetching authenticated user:', userError);
            throw userError;
        }

        if (!user || !user.user) {
            console.error('User is not authenticated');
            throw new Error('User not authenticated');
        }

        // Insert the maintenance item with the user_id
        const { data, error } = await supabase
            .from('maintenance')
            .insert([{
                ...item,
                user_id: user.user.id, // Use authenticated user's UUID
                schedule_date: item.schedule_date || null // Handle optional schedule_date
            }])
            .select(); // Return the inserted item

        // Handle any errors during the insert operation
        if (error) {
            console.error('Error adding maintenance item:', error);
            throw error; // Re-throw the error for the caller to handle
        }

        return data[0]; // Return the first inserted maintenance item
    } catch (error) {
        console.error('Error in addMaintenanceItem:', error);
        throw error; // Ensure errors are propagated
    }
}

export async function fetchFreightData(freightId: number) {
    const { data, error } = await supabase
        .from('freight')
        .select('*')
        .eq('id', freightId)
        .single<Database['public']['Tables']['freight']['Row']>(); // Explicitly define the type here

    if (error) {
        console.error('Error fetching freight data:', error);
        return null;
    }

    return data;
}

export async function addFreightItem(freight: Database['public']['Tables']['freight']['Insert']): Promise<Database['public']['Tables']['freight']['Row'] | null> {
    try {
        const { data, error } = await supabase
            .from('freight')
            .insert([freight])
            .select()
            .single<Database['public']['Tables']['freight']['Row']>(); // Explicitly define the type here

        if (error) {
            console.error('Error adding freight item:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error in addFreightItem:', error);
        throw error;
    }
}

export async function checkDuplicateInventoryNumber(inventoryNumber: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('freight')
        .select('id')
        .eq('inventory_number', inventoryNumber);

    if (error) {
        console.error('Error checking duplicate inventory number:', error);
        throw error;
    }

    return data.length > 0;
}

// New functions for companies table

export async function fetchCompanyByName(companyName: string): Promise<Company | null> {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('name', companyName)
        .maybeSingle<Company>(); // Use maybeSingle to handle no rows returned

    if (error) {
        console.error('Error fetching company by name:', error);
        return null;
    }

    return data;
}

export async function addCompany(companies: Database['public']['Tables']['companies']['Insert']): Promise<Database['public']['Tables']['companies']['Row'] | null> {
    try {
        const { data, error } = await supabase
            .from('companies')
            .insert([companies])
            .select()
            .single<Company>(); // Explicitly define the type here

        if (error) {
            console.error('Error adding company:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error in addCompany:', error);
        throw error;
    }
}

export async function addSubscriber(email: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
        .from('mail_subscribers')
        .insert([{ email }]);

    return { data, error };
}

export async function updateFavoriteStatus(documentId: number, isFavorite: boolean): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
        .from('documents')
        .update({ is_favorite: isFavorite })
        .eq('id', documentId);

    return { data, error };
}

export async function fetchVendorsData() {
    const { data, error } = await supabase
        .from('vendors')
        .select('id, vendornumber, vendorname, businessstreet, businesscity, businessstate, email, phone');

    if (error) {
        console.error('Error fetching vendors:', error);
        return { data: [], error };
    }

    return { data, error };
}

export async function addVendor(vendor: Omit<Vendor, 'id'>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendor])
      .select();
  
    return { data, error };
}

export async function addPurchaseOrder(purchaseOrder: Omit<PurchaseOrder, 'id'>) {
    const { data, error } = await supabase
      .from('purchase_order')
      .insert([purchaseOrder])
      .select();
  
    return { data, error };
}

export async function fetchPurchaseOrders(userId: string) {
    const { data, error } = await supabase
        .from('purchase_order')
        .select('id, ponumber, status, createddate, expecteddate, vendornumber, vendorname, order_description, user_id')
        .eq('user_id', userId); // Filter by user_id

    if (error) {
        console.error('Error fetching purchase orders:', error);
        return { data: [], error };
    }

    return { data, error };
}

export async function updatePurchaseOrderStatus(id: number, status: string) {
    const { data, error } = await supabase
        .from('purchase_order')
        .update({ status })
        .eq('id', id);

    return { data, error };
}

