-- Fix for infinite recursion in RLS policies and missing user access
-- Run this in your Supabase SQL Editor to fix the issue

-- 1. Securely recreate the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop existing policies on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 3. Create Basic User Policies (Breaks Recursion)
-- Allows users to see their own profile without checking admin status
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allows users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Create Admin Policies
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (public.is_admin());

-- 5. Ensure other tables have correct admin policies (Optional refresh)
-- (We don't need to drop/recreate these if the function name is same, but good to ensure they exist)

-- Categories
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (public.is_admin());

-- Products
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (public.is_admin());

-- Variants
DROP POLICY IF EXISTS "Admins can manage variants" ON product_variants;
CREATE POLICY "Admins can manage variants" ON product_variants
  FOR ALL USING (public.is_admin());

-- Combos
DROP POLICY IF EXISTS "Admins can manage combos" ON combos;
CREATE POLICY "Admins can manage combos" ON combos
  FOR ALL USING (public.is_admin());

-- Combo Items
DROP POLICY IF EXISTS "Admins can manage combo items" ON combo_items;
CREATE POLICY "Admins can manage combo items" ON combo_items
  FOR ALL USING (public.is_admin());

-- Orders
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (public.is_admin());

-- Order Items
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (public.is_admin());