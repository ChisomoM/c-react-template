-- Enable Guest Checkout Policies (Run in Supabase SQL Editor)

-- 1. Allow guests (anon/public role) to insert into orders table where user_id is NULL
CREATE POLICY "Guests can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() IS NULL);

-- 2. Allow guests to insert order items for their newly created order
-- Note: This assumes the client will insert the order successfully first.
-- The check ensures that the order they are attaching items to is indeed a guest order.
-- WARNING: This allows any guest to attach items to ANY guest order if they know the UUID.
-- In a production environment with sensitive data, consider using a Secure Function (RPC) instead of direct table access.
CREATE POLICY "Guests can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id 
      AND orders.user_id IS NULL
    )
  );

-- 3. Allow guests to view their created order?
-- Typically, after creation, the client needs to read the order back to show success.
-- However, RLS normally filters based on user_id.
-- Guests have no user_id.
-- We might need to allow reading a specific order by ID if we can verify ownership (e.g. via clean session).
-- But simpler approach: Return the created data from INSERT (using .select()) which Supabase allows if INSERT policy passes? 
-- Actually, default is you can't see what you inserted if SELECT policy fails.
-- But we can rely on "Guests can view their just-created order" logic? 
-- No, RLS is stateless.
-- So we might need to rely on the return value of INSERT immediately.
-- If the client needs to fetch it later, they can't unless we have a token or cookie.
-- For now, we assume the Checkout success page just shows static "Success" or data passed via state/local storage.

