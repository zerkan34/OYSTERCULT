-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    friend_code TEXT UNIQUE,
    is_friend BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier products table
CREATE TABLE IF NOT EXISTS supplier_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    min_order_quantity INTEGER DEFAULT 1,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier orders table
CREATE TABLE IF NOT EXISTS supplier_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    storage_location TEXT,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier order items table
CREATE TABLE IF NOT EXISTS supplier_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES supplier_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES supplier_products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier order comments table
CREATE TABLE IF NOT EXISTS supplier_order_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES supplier_orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update stock on order completion
CREATE OR REPLACE FUNCTION update_stock(
    product_id UUID,
    quantity INTEGER,
    storage_location TEXT,
    expiry_date DATE
) RETURNS void AS $$
BEGIN
    -- Update inventory
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

    -- Add traceability record
    INSERT INTO traceability (
        product_id,
        quantity,
        type,
        storage_location,
        expiry_date
    ) VALUES (
        product_id,
        quantity,
        'supplier_delivery',
        storage_location,
        expiry_date
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to generate friend code
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.friend_code := 'SUP' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate friend code
CREATE TRIGGER trigger_generate_friend_code
    BEFORE INSERT ON suppliers
    FOR EACH ROW
    WHEN (NEW.friend_code IS NULL)
    EXECUTE FUNCTION generate_friend_code();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_update_supplier_timestamp
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_supplier_product_timestamp
    BEFORE UPDATE ON supplier_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_supplier_order_timestamp
    BEFORE UPDATE ON supplier_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_supplier_order_item_timestamp
    BEFORE UPDATE ON supplier_order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
