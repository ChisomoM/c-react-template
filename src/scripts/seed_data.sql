-- Seed Data for E-commerce Demo
-- Run this after schema.sql in your Supabase SQL Editor

-- ============================================================================
-- CATEGORIES
-- ============================================================================
INSERT INTO categories (name, slug) VALUES
  ('Clothing', 'clothing'),
  ('Footwear', 'footwear'),
  ('Accessories', 'accessories')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for reference
DO $$
DECLARE
  clothing_id UUID;
  footwear_id UUID;
  accessories_id UUID;
BEGIN
  SELECT id INTO clothing_id FROM categories WHERE slug = 'clothing';
  SELECT id INTO footwear_id FROM categories WHERE slug = 'footwear';
  SELECT id INTO accessories_id FROM categories WHERE slug = 'accessories';

-- ============================================================================
-- PRODUCTS
-- ============================================================================
  INSERT INTO products (title, description, price_zmw, stock_quantity, category_id, images, is_active) VALUES
    (
      'Classic White Dress Shirt',
      'Premium cotton dress shirt perfect for any formal occasion. Features a modern slim fit, button-down collar, and breathable fabric.',
      450.00,
      50,
      clothing_id,
      ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
      true
    ),
    (
      'Blue Denim Jeans',
      'Classic straight-fit denim jeans made from durable cotton blend. Features five-pocket styling and a comfortable mid-rise waist.',
      850.00,
      40,
      clothing_id,
      ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'],
      true
    ),
    (
      'Executive Charcoal Suit',
      'Premium wool-blend suit jacket and trousers. Italian-inspired tailoring with a modern slim fit. Perfect for business meetings and formal events.',
      3500.00,
      15,
      clothing_id,
      ARRAY['https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'],
      true
    ),
    (
      'Oxford Leather Dress Shoes',
      'Handcrafted genuine leather Oxford shoes with a classic cap-toe design. Features cushioned insole and durable rubber sole.',
      1200.00,
      30,
      footwear_id,
      ARRAY['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800'],
      true
    ),
    (
      'Panama Straw Hat',
      'Elegant woven straw hat with a wide brim. Perfect for sunny days and adds a sophisticated touch to any outfit.',
      280.00,
      25,
      accessories_id,
      ARRAY['https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800', 'https://images.unsplash.com/photo-1576672843344-022139ca5f96?w=800'],
      true
    )
  ON CONFLICT DO NOTHING;

-- ============================================================================
-- PRODUCT VARIANTS
-- ============================================================================
  -- White Dress Shirt Variants
  INSERT INTO product_variants (product_id, size, color, stock_adjustment)
  SELECT id, 'S', 'White', 10 FROM products WHERE title = 'Classic White Dress Shirt'
  UNION ALL
  SELECT id, 'M', 'White', 15 FROM products WHERE title = 'Classic White Dress Shirt'
  UNION ALL
  SELECT id, 'L', 'White', 15 FROM products WHERE title = 'Classic White Dress Shirt'
  UNION ALL
  SELECT id, 'XL', 'White', 10 FROM products WHERE title = 'Classic White Dress Shirt'
  ON CONFLICT DO NOTHING;

  -- Blue Denim Jeans Variants
  INSERT INTO product_variants (product_id, size, color, stock_adjustment)
  SELECT id, '30', 'Blue', 8 FROM products WHERE title = 'Blue Denim Jeans'
  UNION ALL
  SELECT id, '32', 'Blue', 12 FROM products WHERE title = 'Blue Denim Jeans'
  UNION ALL
  SELECT id, '34', 'Blue', 12 FROM products WHERE title = 'Blue Denim Jeans'
  UNION ALL
  SELECT id, '36', 'Blue', 8 FROM products WHERE title = 'Blue Denim Jeans'
  ON CONFLICT DO NOTHING;

  -- Suit Variants
  INSERT INTO product_variants (product_id, size, color, stock_adjustment)
  SELECT id, '38R', 'Charcoal', 3 FROM products WHERE title = 'Executive Charcoal Suit'
  UNION ALL
  SELECT id, '40R', 'Charcoal', 5 FROM products WHERE title = 'Executive Charcoal Suit'
  UNION ALL
  SELECT id, '42R', 'Charcoal', 5 FROM products WHERE title = 'Executive Charcoal Suit'
  UNION ALL
  SELECT id, '44R', 'Charcoal', 2 FROM products WHERE title = 'Executive Charcoal Suit'
  ON CONFLICT DO NOTHING;

  -- Dress Shoes Variants
  INSERT INTO product_variants (product_id, size, color, stock_adjustment)
  SELECT id, '9', 'Black', 8 FROM products WHERE title = 'Oxford Leather Dress Shoes'
  UNION ALL
  SELECT id, '10', 'Black', 10 FROM products WHERE title = 'Oxford Leather Dress Shoes'
  UNION ALL
  SELECT id, '11', 'Black', 8 FROM products WHERE title = 'Oxford Leather Dress Shoes'
  UNION ALL
  SELECT id, '12', 'Black', 4 FROM products WHERE title = 'Oxford Leather Dress Shoes'
  ON CONFLICT DO NOTHING;

  -- Hat Variants
  INSERT INTO product_variants (product_id, size, color, stock_adjustment)
  SELECT id, 'M', 'Natural', 12 FROM products WHERE title = 'Panama Straw Hat'
  UNION ALL
  SELECT id, 'L', 'Natural', 13 FROM products WHERE title = 'Panama Straw Hat'
  ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMBOS
-- ============================================================================
  -- Create "The Gentleman's Starter Pack" combo
  INSERT INTO combos (title, description, discount_percentage, is_active) VALUES
    (
      'The Gentleman''s Starter Pack',
      'Complete your professional wardrobe with this exclusive bundle! Get our premium Executive Charcoal Suit paired with handcrafted Oxford Leather Dress Shoes at an unbeatable price. Save 15% when you buy this combo!',
      15.00,
      true
    )
  ON CONFLICT DO NOTHING;

  -- Link products to the combo
  INSERT INTO combo_items (combo_id, product_id)
  SELECT c.id, p.id
  FROM combos c
  CROSS JOIN products p
  WHERE c.title = 'The Gentleman''s Starter Pack'
    AND p.title IN ('Executive Charcoal Suit', 'Oxford Leather Dress Shoes')
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Display inserted data summary
SELECT 'Categories Created:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products Created:', COUNT(*) FROM products
UNION ALL
SELECT 'Product Variants Created:', COUNT(*) FROM product_variants
UNION ALL
SELECT 'Combos Created:', COUNT(*) FROM combos
UNION ALL
SELECT 'Combo Items Created:', COUNT(*) FROM combo_items;
