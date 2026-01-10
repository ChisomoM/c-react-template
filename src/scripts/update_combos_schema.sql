-- Update Combos table to support standalone combos (not just bundles)
-- Run this in your Supabase SQL Editor

ALTER TABLE combos
ADD COLUMN IF NOT EXISTS price_zmw DECIMAL(10, 2), -- Explicit price for the combo (overrides calculated price if set)
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0, -- Explicit stock for the combo
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'; -- Images for the combo
