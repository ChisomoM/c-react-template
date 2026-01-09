# E-commerce Setup Guide

This guide will walk you through setting up the Zambian E-commerce template with Supabase.

## Step 1: Create a Supabase Project

1. Go to [database.new](https://database.new) or [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Your project name (e.g., "Zambian Shop")
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to Zambia (e.g., "South Africa")
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## Step 2: Set Up the Database

### Run Schema Migration

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the contents of `src/scripts/schema.sql` from this project
4. Paste it into the SQL Editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see a success message

This creates:
- All database tables (profiles, products, categories, orders, etc.)
- Row Level Security (RLS) policies
- Database functions and triggers
- Proper relationships between tables

### Seed Sample Data

1. In the SQL Editor, create another new query
2. Copy the contents of `src/scripts/seed_data.sql`
3. Paste it into the SQL Editor
4. Click "Run"
5. You should see a summary showing:
   - 3 categories created
   - 5 products created
   - Multiple product variants
   - 1 combo created

The seed data includes:
- 1 Classic White Dress Shirt
- 1 Blue Denim Jeans
- 1 Executive Charcoal Suit
- 1 Oxford Leather Dress Shoes
- 1 Panama Straw Hat
- 1 Combo: "The Gentleman's Starter Pack" (Suit + Shoes with 15% discount)

## Step 3: Get Your API Keys

1. In your Supabase dashboard, go to "Settings" (gear icon) in the left sidebar
2. Click on "API" under Project Settings
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: A long JWT token starting with `eyJ...`
4. Keep this page open - you'll need these values next

## Step 4: Configure Your Project

1. In your project root, find the file `.env.local`
2. Open it and replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 5: Install Dependencies

```bash
pnpm install
```

This installs:
- Next.js 15
- React 19
- Supabase JavaScript client
- Tailwind CSS
- Radix UI components
- And all other dependencies

## Step 6: Run the Development Server

```bash
pnpm dev
```

The application will start at `http://localhost:3000`

## Step 7: Create Your First Admin User

Since this is a fresh setup, you'll need to create an admin user:

### Option 1: Using Supabase Dashboard

1. Go to "Authentication" > "Users" in your Supabase dashboard
2. Click "Add User"
3. Choose "Create new user"
4. Enter:
   - **Email**: Your admin email
   - **Password**: Your password
5. Click "Create User"
6. Now go to "SQL Editor" and run:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = (
     SELECT id FROM auth.users 
     WHERE email = 'your-admin-email@example.com'
   );
   ```

### Option 2: Using the Application

1. The seed data doesn't include a user, so you'll need to register first
2. Go to `/login` and create an account
3. After creating your account, go to Supabase Dashboard > Authentication > Users
4. Find your user and note the ID
5. Go to SQL Editor and run the UPDATE query above to make yourself an admin

## Step 8: Test the Application

### Test Public Pages

1. Visit `http://localhost:3000` - Home page
2. Click "Shop Now" or navigate to `/shop`
3. You should see the 5 seeded products
4. Click on a product to view details

### Test Admin Dashboard

1. Go to `/login` and sign in with your admin account
2. You should be redirected to `/admin/dashboard`
3. Click "Products" in the sidebar
4. You should see the list of products
5. Try adding a new product

## Step 9: Customize for Your Business

### Update Branding

1. **Logo/Name**: Edit `src/components/navbar.tsx` to change "ZambianShop"
2. **Colors**: Modify `tailwind.config.mjs` for your brand colors
3. **Meta Tags**: Update `src/app/(public)/page.tsx` metadata

### Add More Products

1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in product details:
   - Title
   - Description
   - Price (in ZMW)
   - Stock quantity
   - Category
   - Images (URLs)

### Configure Categories

Run this SQL in Supabase to add more categories:
```sql
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Home & Garden', 'home-garden'),
  ('Sports', 'sports');
```

## Troubleshooting

### "Failed to load products"

**Issue**: The app can't connect to Supabase

**Solution**:
1. Check your `.env.local` has the correct values
2. Make sure you're using `NEXT_PUBLIC_` prefix for the env vars
3. Restart your dev server after changing env vars

### "Row Level Security policy violation"

**Issue**: Trying to access data without proper permissions

**Solution**:
1. Make sure you ran the schema.sql which includes RLS policies
2. Check you're logged in if trying to access protected routes
3. Verify your user has the `admin` role in the profiles table

### "Table does not exist"

**Issue**: Database schema not set up

**Solution**:
1. Go to Supabase SQL Editor
2. Run `src/scripts/schema.sql`
3. Verify tables exist in "Table Editor"

### Products showing as empty

**Issue**: Seed data not loaded

**Solution**:
1. Go to Supabase SQL Editor
2. Run `src/scripts/seed_data.sql`
3. Check "Table Editor" > "products" to verify data

## Next Steps

- Set up Supabase Storage for product image uploads
- Configure email templates in Supabase Auth settings
- Set up a custom domain in Supabase
- Enable additional auth providers (Google, Facebook, etc.)
- Set up webhooks for order notifications
- Configure Mobile Money integration for Zambia (MTN, Airtel)
- Add more products and categories
- Customize the checkout flow
- Set up email notifications

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

For Next.js issues:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
