-- 20230101000000_create_shippingquotes_table.sql
CREATE TABLE shippingquotes (
  id serial PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_complete boolean,
  origin_city text,
  origin_state text,
  origin_zip text,
  destination_city text,
  destination_state text,
  destination_zip text,
  user_id uuid NOT NULL,
  due_date timestamp with time zone,
  year_amount text,
  make text,
  model text,
  pallet_count text,
  commodity text
);

ALTER TABLE shippingquotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Individuals can create shippingquotes." ON shippingquotes FOR
    INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Individuals can view their own shippingquotes." ON shippingquotes FOR
    SELECT USING (auth.uid() = user_id);
CREATE POLICY "Individuals can update their own shippingquotes." ON shippingquotes FOR
    UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Individuals can delete their own shippingquotes." ON shippingquotes FOR
    DELETE USING (auth.uid() = user_id);