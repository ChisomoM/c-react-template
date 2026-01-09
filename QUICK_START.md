# Quick Start Guide

Get your Zambian e-commerce site running in 10 minutes!

## Step 1: Create Supabase Project (3 min)

1. Go to [database.new](https://database.new)
2. Sign in/Sign up
3. Create new project
4. Wait for setup to complete

## Step 2: Set Up Database (2 min)

1. Open Supabase Dashboard → SQL Editor
2. Copy & paste `src/scripts/schema.sql` → Run
3. Copy & paste `src/scripts/seed_data.sql` → Run
4. **Fix RLS Policies**: Copy & paste `src/scripts/fix_rls_recursion.sql` → Run
5. Verify: Go to Table Editor, you should see products

## Step 3: Get API Keys (1 min)

1. Supabase Dashboard → Settings → API
2. Copy "Project URL"
3. Copy "Anon/Public Key"

## Step 4: Configure Project (1 min)

Open `.env.local` and update:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Install & Run (3 min)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` 🎉

## Step 6: Create Admin Account

### Option A: Quick Way (SQL)
In Supabase SQL Editor:
```sql
-- Create admin user
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@example.com', crypt('admin123', gen_salt('bf')), NOW());

-- Make them admin
UPDATE profiles SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### Option B: Manual Way
1. Go to `/login` and register
2. Supabase Dashboard → Authentication → Users
3. Find your user, copy ID
4. SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

## What You Get Out of the Box

### Public Site
- **Home Page** (`/`) - Hero, features, CTA
- **Shop** (`/shop`) - 5 sample products ready to browse
- **Navigation** - Responsive navbar with cart icon

### Admin Dashboard
- **Dashboard** (`/admin/dashboard`) - KPIs and stats
- **Products** (`/admin/products`) - Manage your catalog
- **Sidebar** - Easy navigation

### Sample Data
- 5 Products (Shirt, Jeans, Suit, Shoes, Hat)
- 3 Categories (Clothing, Footwear, Accessories)
- 1 Combo (Suit + Shoes, 15% off)
- All with variants (sizes, colors)

## Test It Works

### Public Flow
```
1. Visit http://localhost:3000
2. Click "Shop Now"
3. See 5 products
4. Click "Add to Cart" on any product
5. Sign up if needed
6. Cart syncs ✅
```

### Admin Flow
```
1. Login with admin account
2. Go to /admin/dashboard
3. Click "Products" in sidebar
4. See product list
5. Click "Add Product" ✅
```

## Common Issues

### "Failed to load products"
- Check `.env.local` is correct
- Restart dev server: `Ctrl+C` then `pnpm dev`

### "Row Level Security violation"
- Run `schema.sql` again in Supabase SQL Editor
- Make sure you're logged in

### Products showing as empty
- Run `seed_data.sql` in Supabase SQL Editor
- Check Table Editor → products table

## Next Steps

1. **Customize Branding**
   - Edit `src/components/navbar.tsx` for logo/name
   - Update colors in `tailwind.config.mjs`

2. **Add More Products**
   - Go to `/admin/products`
   - Click "Add Product"
   - Fill in details

3. **Set Up Supabase Storage**
   - Dashboard → Storage → Create bucket "products"
   - Enable public access
   - Upload product images

4. **Deploy to Vercel**
   ```bash
   pnpm build
   vercel --prod
   ```
   Add env vars in Vercel dashboard

## Get Help

- **Setup Issues**: See `SETUP_GUIDE.md`
- **Features**: See `IMPLEMENTATION_SUMMARY.md`
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

## You're Ready! 🚀

Your e-commerce site is now running with:
- ✅ Supabase backend
- ✅ Admin dashboard
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Sample data
- ✅ Secure authentication

Happy building! 🎉
