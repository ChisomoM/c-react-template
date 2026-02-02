-- ============================================================================
-- MODIFIERS SYSTEM SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================================
-- This migration adds support for product modifiers (add-ons/extras)
-- Example: Extra milk, gift wrapping, size upgrades, etc.
-- ============================================================================

-- ============================================================================
-- 1. MODIFIERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_zmw DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (price_zmw >= 0),
  cost_price_zmw DECIMAL(10, 2) DEFAULT 0 CHECK (cost_price_zmw >= 0),
  
  -- Inventory tracking
  track_inventory BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 10,
  
  -- Quantity limits (per order)
  min_quantity INTEGER DEFAULT 0 CHECK (min_quantity >= 0),
  max_quantity INTEGER DEFAULT 1 CHECK (max_quantity >= min_quantity),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_global BOOLEAN DEFAULT false,  -- true = available for all products
  
  -- Metadata
  sku TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_modifiers_is_active ON modifiers(is_active);
CREATE INDEX IF NOT EXISTS idx_modifiers_is_global ON modifiers(is_global);
CREATE INDEX IF NOT EXISTS idx_modifiers_sort_order ON modifiers(sort_order);

-- Enable RLS
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;

-- Public can view active modifiers
DROP POLICY IF EXISTS "Anyone can view active modifiers" ON modifiers;
CREATE POLICY "Anyone can view active modifiers" ON modifiers
  FOR SELECT USING (is_active = true);

-- Admins can view all modifiers
DROP POLICY IF EXISTS "Admins can view all modifiers" ON modifiers;
CREATE POLICY "Admins can view all modifiers" ON modifiers
  FOR SELECT USING (public.is_admin());

-- Admins can manage modifiers
DROP POLICY IF EXISTS "Admins can manage modifiers" ON modifiers;
CREATE POLICY "Admins can manage modifiers" ON modifiers
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 2. PRODUCT_MODIFIERS TABLE (Junction Table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  modifier_id UUID NOT NULL REFERENCES modifiers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(product_id, modifier_id)
);

-- Create indexes for faster joins
CREATE INDEX IF NOT EXISTS idx_product_modifiers_product_id ON product_modifiers(product_id);
CREATE INDEX IF NOT EXISTS idx_product_modifiers_modifier_id ON product_modifiers(modifier_id);

-- Enable RLS
ALTER TABLE product_modifiers ENABLE ROW LEVEL SECURITY;

-- Anyone can view product modifiers
DROP POLICY IF EXISTS "Anyone can view product modifiers" ON product_modifiers;
CREATE POLICY "Anyone can view product modifiers" ON product_modifiers
  FOR SELECT USING (true);

-- Admins can manage product modifiers
DROP POLICY IF EXISTS "Admins can manage product modifiers" ON product_modifiers;
CREATE POLICY "Admins can manage product modifiers" ON product_modifiers
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 3. ALTER CART_ITEMS TABLE
-- ============================================================================
-- Add modifiers column to store selected modifiers
-- Structure: [{ modifier_id: string, quantity: number }]
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cart_items' AND column_name = 'modifiers'
  ) THEN
    ALTER TABLE cart_items 
    ADD COLUMN modifiers JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- ============================================================================
-- 4. ALTER ORDER_ITEMS TABLE
-- ============================================================================
-- Add modifiers column to store modifier snapshot at purchase time
-- Structure: [{ modifier_id: string, name: string, quantity: number, price_at_purchase: number }]
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'order_items' AND column_name = 'modifiers'
  ) THEN
    ALTER TABLE order_items 
    ADD COLUMN modifiers JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================
-- Trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS update_modifiers_updated_at ON modifiers;
CREATE TRIGGER update_modifiers_updated_at 
  BEFORE UPDATE ON modifiers
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Function to adjust modifier stock (similar to product stock adjustment)
CREATE OR REPLACE FUNCTION adjust_modifier_stock(
  p_modifier_id UUID,
  p_change_amount INTEGER,
  p_reason TEXT,
  p_note TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
) RETURNS INTEGER AS $$
DECLARE
  v_current_stock INTEGER;
  v_new_stock INTEGER;
  v_track_inventory BOOLEAN;
BEGIN
  -- Get current stock and check if tracking is enabled
  SELECT stock_quantity, track_inventory 
  INTO v_current_stock, v_track_inventory
  FROM modifiers 
  WHERE id = p_modifier_id 
  FOR UPDATE;
  
  IF NOT FOUND THEN 
    RAISE EXCEPTION 'Modifier not found'; 
  END IF;
  
  -- If not tracking inventory, allow operation without stock changes
  IF NOT v_track_inventory THEN
    RETURN v_current_stock;
  END IF;
  
  v_new_stock := v_current_stock + p_change_amount;
  
  IF v_new_stock < 0 THEN 
    RAISE EXCEPTION 'Insufficient stock for modifier'; 
  END IF;
  
  UPDATE modifiers 
  SET stock_quantity = v_new_stock 
  WHERE id = p_modifier_id;
  
  -- Optional: Add logging to inventory_logs table if needed in the future
  -- INSERT INTO inventory_logs (modifier_id, change_amount, final_stock, reason, note, created_by)
  -- VALUES (p_modifier_id, p_change_amount, v_new_stock, p_reason, p_note, p_user_id);
  
  RETURN v_new_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. SAMPLE DATA (Optional - for testing)
-- ============================================================================
-- Uncomment below to insert sample modifiers

/*
-- Global modifiers (available for all products)
INSERT INTO modifiers (name, description, price_zmw, is_global, is_active, sort_order)
VALUES 
  ('Gift Wrapping', 'Beautiful gift wrapping with ribbon', 15.00, true, true, 1),
  ('Express Shipping', 'Next-day delivery', 50.00, true, true, 2);

-- Product-specific modifiers (examples for a coffee shop)
INSERT INTO modifiers (name, description, price_zmw, is_global, is_active, min_quantity, max_quantity, track_inventory, stock_quantity, sort_order)
VALUES 
  ('Extra Shot', 'Add an extra espresso shot', 5.00, false, true, 0, 3, false, 0, 1),
  ('Oat Milk', 'Substitute with oat milk', 8.00, false, true, 0, 1, true, 100, 2),
  ('Whipped Cream', 'Top with whipped cream', 3.00, false, true, 0, 1, false, 0, 3);
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Verify tables exist: modifiers, product_modifiers
-- 3. Verify cart_items and order_items have 'modifiers' column
-- 4. Test RLS policies work (public can view active, admin can manage)
-- ============================================================================
