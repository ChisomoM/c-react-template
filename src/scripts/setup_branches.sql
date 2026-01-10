-- Branch Management & Inventory Pools
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- 1. BRANCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Admins can manage branches" ON branches FOR ALL USING (public.is_admin());

-- ============================================================================
-- 2. BRANCH STAFF TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS branch_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'staff',
  permissions TEXT[] DEFAULT '{}', -- ['manage_inventory', 'manage_orders', 'view_reports', 'manage_staff']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(branch_id, user_id)
);

-- RLS
ALTER TABLE branch_staff ENABLE ROW LEVEL SECURITY;

-- Allow users to see where they work
CREATE POLICY "Staff can view their own assignment" ON branch_staff 
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view/manage all staff
CREATE POLICY "Global Admins can manage staff" ON branch_staff 
  FOR ALL USING (public.is_admin());

-- Branch Managers can view staff in their branch
CREATE POLICY "Branch Managers can view branch staff" ON branch_staff
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_staff bs
      WHERE bs.user_id = auth.uid()
      AND bs.branch_id = branch_staff.branch_id
      AND 'manage_staff' = ANY(bs.permissions)
    )
  );

-- Function to check if user has permission at a specific branch
CREATE OR REPLACE FUNCTION public.has_branch_permission(check_branch_id UUID, required_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Global admins have all permissions
  IF public.is_admin() THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.branch_staff
    WHERE branch_id = check_branch_id
    AND user_id = auth.uid()
    AND required_permission = ANY(permissions)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. BRANCH INVENTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS branch_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE, -- NULL for simple products
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Unique Indices to handle NULL variant_id correctly
CREATE UNIQUE INDEX IF NOT EXISTS branch_inventory_simple_idx ON branch_inventory (branch_id, product_id) WHERE variant_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS branch_inventory_variant_idx ON branch_inventory (branch_id, product_id, variant_id) WHERE variant_id IS NOT NULL;

-- RLS
ALTER TABLE branch_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view branch inventory" ON branch_inventory FOR SELECT USING (true);

-- Staff with 'manage_inventory' at this branch can update
CREATE POLICY "Staff can manage inventory at their branch" ON branch_inventory 
  FOR ALL USING (
    public.has_branch_permission(branch_id, 'manage_inventory')
  );

-- ============================================================================
-- 4. SYNC TRIGGERS (Distributed Inventory -> Global Display Stock)
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_inventory_stock()
RETURNS TRIGGER AS $$
DECLARE
  v_product_id UUID;
  v_variant_id UUID;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_product_id := OLD.product_id;
    v_variant_id := OLD.variant_id;
  ELSE
    v_product_id := NEW.product_id;
    v_variant_id := NEW.variant_id;
  END IF;

  IF v_variant_id IS NOT NULL THEN
    -- It's a variant: Sum all branches for this variant
    UPDATE product_variants
    SET stock_quantity = (
      SELECT COALESCE(SUM(quantity), 0)
      FROM branch_inventory
      WHERE variant_id = v_variant_id
    )
    WHERE id = v_variant_id;
  ELSE
    -- It's a simple product: Sum all branches for this product (where variant is null)
    UPDATE products
    SET stock_quantity = (
      SELECT COALESCE(SUM(quantity), 0)
      FROM branch_inventory
      WHERE product_id = v_product_id
      AND variant_id IS NULL
    )
    WHERE id = v_product_id;
  END IF;

  RETURN NULL; -- Result is ignored for AFTER triggers
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_inventory ON branch_inventory;
CREATE TRIGGER trigger_sync_inventory
AFTER INSERT OR UPDATE OR DELETE ON branch_inventory
FOR EACH ROW
EXECUTE FUNCTION sync_inventory_stock();


-- ============================================================================
-- 5. MIGRATION (Move existing stock to default branch)
-- ============================================================================
DO $$
DECLARE
  v_main_branch_id UUID;
BEGIN
  -- 1. Create Default Branch if not exists
  -- Using a known UUID or searching by name
  SELECT id INTO v_main_branch_id FROM branches WHERE name = 'Main Warehouse';
  
  IF v_main_branch_id IS NULL THEN
    INSERT INTO branches (name, location, is_active)
    VALUES ('Main Warehouse', 'HQ', true)
    RETURNING id INTO v_main_branch_id;
  END IF;

  -- 2. Migrate Variants
  -- Insert current variant stock into the main branch
  INSERT INTO branch_inventory (branch_id, product_id, variant_id, quantity)
  SELECT 
    v_main_branch_id,
    product_id,
    id,
    stock_quantity
  FROM product_variants
  WHERE stock_quantity > 0
  ON CONFLICT (branch_id, product_id, variant_id) WHERE variant_id IS NOT NULL 
  DO UPDATE SET quantity = EXCLUDED.quantity;

  -- 3. Migrate Simple Products
  -- Insert current simple product stock into main branch
  INSERT INTO branch_inventory (branch_id, product_id, quantity)
  SELECT 
    v_main_branch_id,
    id,
    stock_quantity
  FROM products
  WHERE stock_quantity > 0
  AND NOT EXISTS (SELECT 1 FROM product_variants WHERE product_id = products.id)
  ON CONFLICT (branch_id, product_id) WHERE variant_id IS NULL 
  DO UPDATE SET quantity = EXCLUDED.quantity;

END $$;

-- ============================================================================
-- 6. ADMIN HELPER FUNCTIONS
-- ============================================================================

-- Function to lookup user ID by email (Admin only)
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email_input TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Only allow admins to call this
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = email_input;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely upsert branch inventory handling NULL variants
CREATE OR REPLACE FUNCTION public.upsert_branch_inventory(
  p_branch_id UUID,
  p_product_id UUID,
  p_variant_id UUID,
  p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
  IF p_variant_id IS NOT NULL THEN
    INSERT INTO branch_inventory (branch_id, product_id, variant_id, quantity)
    VALUES (p_branch_id, p_product_id, p_variant_id, p_quantity)
    ON CONFLICT (branch_id, product_id, variant_id) WHERE variant_id IS NOT NULL 
    DO UPDATE SET quantity = EXCLUDED.quantity;
  ELSE
    INSERT INTO branch_inventory (branch_id, product_id, variant_id, quantity)
    VALUES (p_branch_id, p_product_id, NULL, p_quantity)
    ON CONFLICT (branch_id, product_id) WHERE variant_id IS NULL 
    DO UPDATE SET quantity = EXCLUDED.quantity;
  END IF;
END;
$$ LANGUAGE plpgsql;


