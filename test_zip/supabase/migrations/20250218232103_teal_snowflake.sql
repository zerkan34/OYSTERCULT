/*
  # Initial Schema Setup for Oyster Cult Enterprise Management System

  1. Authentication and Users
    - Extended user profiles with additional fields
    - Role-based access control
    
  2. Task Management
    - Tasks table with subtasks support
    - Task assignments and status tracking
    - Task categories and priorities
    
  3. Inventory Management
    - Stock items and tracking
    - Stock movements and history
    - Batch management
    
  4. Sales and Purchases
    - Sales records
    - Purchase orders
    - Invoice tracking
    
  5. HR Management
    - Employee records
    - Time tracking
    - Performance evaluations
    
  6. Security
    - Row Level Security (RLS) policies
    - Data access controls
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now(),
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'employee',
  department text,
  position text,
  hire_date date,
  employee_id text UNIQUE,
  contact_email text,
  phone text,
  emergency_contact text,
  is_active boolean DEFAULT true,
  last_login timestamptz
);

-- Tasks
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  due_date timestamptz,
  category text,
  created_by uuid REFERENCES profiles(id),
  assigned_to uuid REFERENCES profiles(id),
  parent_task_id uuid REFERENCES tasks(id),
  is_recurring boolean DEFAULT false,
  recurrence_pattern text,
  estimated_hours numeric(5,2),
  actual_hours numeric(5,2),
  completion_date timestamptz,
  tags text[]
);

-- Task Comments
CREATE TABLE task_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  attachments text[]
);

-- Inventory Items
CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  sku text UNIQUE,
  category text,
  unit text,
  minimum_stock numeric(10,2),
  current_stock numeric(10,2) DEFAULT 0,
  reorder_point numeric(10,2),
  cost_price numeric(10,2),
  selling_price numeric(10,2),
  location text,
  supplier_id uuid,
  is_active boolean DEFAULT true,
  last_restock_date timestamptz,
  expiry_date timestamptz
);

-- Stock Movements
CREATE TABLE stock_movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  item_id uuid REFERENCES inventory_items(id),
  movement_type text NOT NULL,
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2),
  reference_number text,
  notes text,
  performed_by uuid REFERENCES profiles(id),
  batch_number text,
  location_from text,
  location_to text
);

-- Sales
CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  customer_id text,
  total_amount numeric(10,2) NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_method text,
  invoice_number text UNIQUE,
  notes text,
  sales_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Sale Items
CREATE TABLE sale_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE,
  item_id uuid REFERENCES inventory_items(id),
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  discount numeric(10,2) DEFAULT 0
);

-- Time Entries
CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES profiles(id),
  date date NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  break_duration interval,
  task_id uuid REFERENCES tasks(id),
  notes text,
  status text DEFAULT 'pending',
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz
);

-- Performance Reviews
CREATE TABLE performance_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  employee_id uuid REFERENCES profiles(id),
  reviewer_id uuid REFERENCES profiles(id),
  review_date date NOT NULL,
  review_period text,
  overall_rating numeric(3,2),
  strengths text[],
  areas_for_improvement text[],
  goals text[],
  comments text,
  status text DEFAULT 'draft',
  acknowledged_at timestamptz,
  next_review_date date
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles but only edit their own
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Tasks: Users can view all tasks, but only edit tasks they created or are assigned to
CREATE POLICY "Users can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update assigned tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Task Comments: Users can view all comments but only edit their own
CREATE POLICY "Users can view all task comments"
  ON task_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create task comments"
  ON task_comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own comments"
  ON task_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Inventory: All authenticated users can view
CREATE POLICY "Users can view inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (true);

-- Stock Movements: All authenticated users can view
CREATE POLICY "Users can view stock movements"
  ON stock_movements FOR SELECT
  TO authenticated
  USING (true);

-- Sales: All authenticated users can view
CREATE POLICY "Users can view sales"
  ON sales FOR SELECT
  TO authenticated
  USING (true);

-- Time Entries: Users can view their own entries
CREATE POLICY "Users can view own time entries"
  ON time_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own time entries"
  ON time_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Performance Reviews: Users can view their own reviews
CREATE POLICY "Users can view own performance reviews"
  ON performance_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id);

-- Functions and Triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Update stock levels on movement
CREATE OR REPLACE FUNCTION update_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.movement_type = 'in' THEN
        UPDATE inventory_items
        SET current_stock = current_stock + NEW.quantity
        WHERE id = NEW.item_id;
    ELSIF NEW.movement_type = 'out' THEN
        UPDATE inventory_items
        SET current_stock = current_stock - NEW.quantity
        WHERE id = NEW.item_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_on_movement
    AFTER INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE PROCEDURE update_stock_levels();