// Seed script to populate Supabase with initial data
// Run with: node src/scripts/seed.js

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function seedDatabase() {
  console.log('🌱 Seeding database...')

  try {
    // Insert categories
    console.log('Inserting categories...')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .upsert([
        { name: 'Clothing', slug: 'clothing' },
        { name: 'Footwear', slug: 'footwear' },
        { name: 'Accessories', slug: 'accessories' }
      ], { onConflict: 'slug' })
      .select()

    if (catError) throw catError
    console.log('✅ Categories inserted:', categories)

    // Get category IDs
    const clothing = categories.find(c => c.slug === 'clothing')
    const footwear = categories.find(c => c.slug === 'footwear')
    const accessories = categories.find(c => c.slug === 'accessories')

    // Insert products
    console.log('Inserting products...')
    const products = [
      {
        title: 'Classic White Dress Shirt',
        description: 'Premium cotton dress shirt perfect for any formal occasion. Features a modern slim fit, button-down collar, and breathable fabric.',
        price_zmw: 450.00,
        stock_quantity: 50,
        category_id: clothing.id,
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
        is_active: true
      },
      {
        title: 'Blue Denim Jeans',
        description: 'Classic straight-fit denim jeans made from durable cotton blend. Features five-pocket styling and a comfortable mid-rise waist.',
        price_zmw: 850.00,
        stock_quantity: 40,
        category_id: clothing.id,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'],
        is_active: true
      },
      {
        title: 'Executive Charcoal Suit',
        description: 'Premium wool-blend suit jacket and trousers. Italian-inspired tailoring with a modern slim fit. Perfect for business meetings and formal events.',
        price_zmw: 3500.00,
        stock_quantity: 15,
        category_id: clothing.id,
        images: ['https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'],
        is_active: true
      },
      {
        title: 'Oxford Leather Dress Shoes',
        description: 'Handcrafted genuine leather Oxford shoes with a classic cap-toe design. Features cushioned insole and durable rubber sole.',
        price_zmw: 1200.00,
        stock_quantity: 30,
        category_id: footwear.id,
        images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800'],
        is_active: true
      },
      {
        title: 'Panama Straw Hat',
        description: 'Elegant woven straw hat with a wide brim. Perfect for sunny days and adds a sophisticated touch to any outfit.',
        price_zmw: 280.00,
        stock_quantity: 25,
        category_id: accessories.id,
        images: ['https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800', 'https://images.unsplash.com/photo-1576672843344-022139ca5f96?w=800'],
        is_active: true
      }
    ]

    const { data: insertedProducts, error: prodError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'title' })
      .select()

    if (prodError) throw prodError
    console.log('✅ Products inserted:', insertedProducts.length)

    console.log('🎉 Database seeded successfully!')

  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
  }
}

seedDatabase()