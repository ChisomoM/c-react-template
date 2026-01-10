-- Add payment_method column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('card', 'mobile_money'));

-- Update RLS if needed (usually columns don't affect row policies unless specified, but good to know)
-- No changes to RLS needed for just adding a column if the policy is on rows.
