-- Step 1: Drop all existing tables
DROP TABLE IF EXISTS public.freight CASCADE;
DROP TABLE IF EXISTS public.shippingquotes CASCADE;
DROP TABLE IF EXISTS public.maintenance CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.usage_stats CASCADE;

-- Step 2: Recreate the tables with the specified schema

-- Table: freight
CREATE TABLE public.freight (
    id SERIAL PRIMARY KEY,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_complete BOOLEAN,
    freight_type TEXT,
    make TEXT,
    model TEXT,
    year TEXT,
    pallets TEXT,
    serial_number TEXT,
    dimensions TEXT,
    freight_id TEXT,
    freight_class TEXT,
    status TEXT,
    user_id UUID REFERENCES auth.users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    in_progress BOOLEAN,
    reminder_time TIMESTAMP WITH TIME ZONE,
    year_amount TEXT,
    pallet_count TEXT,
    commodity TEXT,
    length TEXT,
    length_unit TEXT,
    width TEXT,
    width_unit TEXT,
    height TEXT,
    height_unit TEXT,
    weight TEXT,
    weight_unit TEXT,
    inventory_number TEXT
);

-- Table: shippingquotes
CREATE TABLE public.shippingquotes (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_complete BOOLEAN,
    origin_city TEXT,
    origin_state TEXT,
    origin_zip TEXT,
    origin_street TEXT,
    destination_city TEXT,
    destination_state TEXT,
    destination_zip TEXT,
    destination_street TEXT,
    user_id UUID REFERENCES auth.users(id),
    quote_id TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    year_amount TEXT,
    make TEXT,
    model TEXT,
    pallet_count TEXT,
    commodity TEXT,
    length TEXT,
    width TEXT,
    height TEXT,
    weight TEXT,
    price NUMERIC,
    is_archived BOOLEAN
);

-- Table: maintenance
CREATE TABLE public.maintenance (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    freight_id INTEGER REFERENCES public.freight(id),
    urgency TEXT,
    notes TEXT,
    need_parts BOOLEAN,
    part TEXT,
    schedule_date TIMESTAMP WITH TIME ZONE,
    maintenance_crew TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    make TEXT,
    model TEXT,
    year TEXT,
    year_amount TEXT,
    pallets TEXT,
    serial_number TEXT,
    dimensions TEXT,
    commodity TEXT,
    inventory_number TEXT
);

-- Table: companies
CREATE TABLE public.companies (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    size TEXT NOT NULL
);

-- Table: orders
CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER REFERENCES public.shippingquotes(id),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT,
    is_archived BOOLEAN,
    earliest_pickup_date TIMESTAMP WITH TIME ZONE,
    latest_pickup_date TIMESTAMP WITH TIME ZONE,
    origin_street TEXT,
    destination_street TEXT,
    cancellation_reason TEXT,
    notes TEXT
);

-- Table: profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    role TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    company_size TEXT,
    company_id UUID REFERENCES public.companies(id),
    profile_picture TEXT,
    address TEXT,
    phone_number TEXT,
    email_notifications BOOLEAN DEFAULT false
);

-- Table: notifications
CREATE TABLE public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: documents
CREATE TABLE public.documents (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: usage_stats
CREATE TABLE public.usage_stats (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    login_count INTEGER NOT NULL,
    active_time INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);