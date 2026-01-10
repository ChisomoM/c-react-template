-- Inventory Management Schema Update
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- 1. UPDATES TO PRODUCTS TABLE
-- ============================================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS cost_price_zmw DECIMAL(10, 2) DEFAULT 0 CHECK (cost_price_zmw >= 0),
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;

-- ============================================================================
-- 2. UPDATES TO PRODUCT VARIANTS TABLE
-- ============================================================================
-- We are moving from 'stock_adjustment' (relative) to 'stock_quantity' (absolute) for variants
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS cost_price_zmw DECIMAL(10, 2) CHECK (cost_price_zmw >= 0);

-- Ensure SKU matches pattern or is unique if provided
DO $$
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_variants_sku_unique') THEN
        ALTER TABLE product_variants ADD CONSTRAINT product_variants_sku_unique UNIQUE (sku);
    END IF;
END $$;

-- ============================================================================
-- 3. INVENTORY LOGS TABLE (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL, -- Positive for add, negative for remove
  final_stock INTEGER NOT NULL, -- Snapshot of stock after change
  reason TEXT NOT NULL, -- 'order', 'restock', 'correction', 'return', 'initial'
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for logs
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
DROP POLICY IF EXISTS "Admins can view inventory logs" ON inventory_logs;
CREATE POLICY "Admins can view inventory logs" ON inventory_logs
  FOR SELECT USING (public.is_admin());

-- Admins can insert logs
DROP POLICY IF EXISTS "Admins can create inventory logs" ON inventory_logs;
CREATE POLICY "Admins can create inventory logs" ON inventory_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- ============================================================================
-- 4. FUNCTION TO ADJUST STOCK
-- ============================================================================
-- This function handles the atomic update of stock and creation of a log entry
CREATE OR REPLACE FUNCTION adjust_stock(
  p_product_id UUID,
  p_variant_id UUID, -- NULL if simple product
  p_change_amount INTEGER,
  p_reason TEXT,
  p_note TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
) RETURNS INTEGER AS $$
DECLARE
  v_current_stock INTEGER;
  v_new_stock INTEGER;
BEGIN
  -- Determine target and lock row for update
  IF p_variant_id IS NOT NULL THEN
    SELECT stock_quantity INTO v_current_stock 
    FROM product_variants 
    WHERE id = p_variant_id 
    FOR UPDATE;
    
    IF NOT FOUND THEN RAISE EXCEPTION 'Variant not found'; END IF;
    
    v_new_stock := v_current_stock + p_change_amount;
    
    IF v_new_stock < 0 THEN RAISE EXCEPTION 'Insufficient stock'; END IF;
    
    UPDATE product_variants 
    SET stock_quantity = v_new_stock 
    WHERE id = p_variant_id;
  ELSE
    SELECT stock_quantity INTO v_current_stock 
    FROM products 
    WHERE id = p_product_id 
    FOR UPDATE;
    
    IF NOT FOUND THEN RAISE EXCEPTION 'Product not found'; END IF;
    
    v_new_stock := v_current_stock + p_change_amount;
    
    IF v_new_stock < 0 THEN RAISE EXCEPTION 'Insufficient stock'; END IF;
    
    UPDATE products 
    SET stock_quantity = v_new_stock 
    WHERE id = p_product_id;
  END IF;

  -- Insert Log
  INSERT INTO inventory_logs (
    product_id, variant_id, change_amount, final_stock, reason, note, created_by
  ) VALUES (
    p_product_id, p_variant_id, p_change_amount, v_new_stock, p_reason, p_note, p_user_id
  );

  RETURN v_new_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
