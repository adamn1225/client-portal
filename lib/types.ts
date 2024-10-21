// types.ts

export type Profile = {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
};

export type User = {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    profile_picture: string | null;
    address: string | null;
    phone_number: string | null;
    role: string;
    inserted_at: string;
};

export type Quote = {
    id: number;
    inserted_at: string;
    is_complete: boolean | null;
    origin_city: string | null;
    origin_state: string | null;
    origin_zip: string | null;
    destination_city: string | null;
    destination_state: string | null;
    destination_zip: string | null;
    user_id: string;
    due_date: string | null;
    year_amount: string | null;
    make: string | null;
    model: string | null;
    pallet_count: string | null;
    commodity: string | null;
    height: string | null;
    width: string | null;
    length: string | null;
    weight: string | null;
    first_name: string | null;
    last_name: string | null;
    quote_id: string | null;
    email: string | null;
    price: number | null;
    is_archived: boolean | null;
};