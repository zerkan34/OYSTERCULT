-- Create suppliers table
CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    friend_code TEXT UNIQUE,
    is_friend BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create supplier_products table
CREATE TABLE supplier_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create supplier_orders table
CREATE TABLE supplier_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    products JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    storage_location TEXT,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create function to update inventory
CREATE OR REPLACE FUNCTION update_inventory(
    product_id UUID,
    quantity INTEGER,
    storage_location TEXT,
    expiry_date DATE
) RETURNS void AS $$
BEGIN
    -- Insert into inventory table
    INSERT INTO inventory (
        product_id,
        quantity,
        storage_location,
        expiry_date
    ) VALUES (
        product_id,
        quantity,
        storage_location,
        expiry_date
    );
END;
$$ LANGUAGE plpgsql;
