-- Fix for infinite recursion in RLS policies
-- Run this in your Supabase SQL Editor to fix the issue

-- Function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can manage variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can manage combos" ON combos;
DROP POLICY IF EXISTS "Admins can manage combo items" ON combo_items;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- Recreate policies with fixed function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage variants" ON product_variants
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage combos" ON combos
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage combo items" ON combo_items
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (public.is_admin());