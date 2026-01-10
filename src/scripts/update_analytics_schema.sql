-- Update schema to support Analytics and Reports
-- Run this in your Supabase SQL Editor

-- 1. Add 'returned' status to orders
-- Note: Modifying a check constraint in Postgres usually involves dropping and re-adding it
ALTER TABLE orders DROP CONSTRAINT orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'returned'));

-- 2. Add Cost Price for Net Profit calculation
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cost_price_zmw DECIMAL(10, 2);

-- 3. Add Low Stock Threshold for Inventory Alerts
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10;

-- 4. Backfill default values if needed (optional)
-- UPDATE products SET cost_price_zmw = price_zmw * 0.7 WHERE cost_price_zmw IS NULL; 
-- (Assuming ~30% margin for existing data as a placeholder, uncomment if desired)
