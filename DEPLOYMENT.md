# Deployment Checklist

Use this checklist to deploy your e-commerce application to production.

## Pre-Deployment Checklist

### 1. Supabase Configuration ✓

- [ ] Production Supabase project created
- [ ] Database schema applied (`schema.sql`)
- [ ] **RLS Recursion Fix**: Apply `fix_rls_recursion.sql` to prevent infinite recursion errors
- [ ] Seed data loaded (optional for production)
- [ ] Row Level Security (RLS) policies verified
- [ ] Supabase Storage bucket created for product images
- [ ] API keys copied (URL and anon key)

### 2. Environment Variables ✓

Production `.env` should have:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### 3. Code Quality ✓

- [ ] Run TypeScript check: `pnpm tsc --noEmit`
- [ ] Run linter: `pnpm lint`
- [ ] Fix all critical errors
- [ ] Test build locally: `pnpm build`

### 4. Testing ✓

- [ ] Test user registration
- [ ] Test user login/logout
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test admin dashboard access
- [ ] Test product management (CRUD)
- [ ] Test on mobile devices

### 5. Security ✓

- [ ] Verify RLS policies are enabled on all tables
- [ ] Check that admin routes require authentication
- [ ] Verify users can only access their own data
- [ ] Review and update CORS settings in Supabase
- [ ] Enable email confirmation (optional)

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # If not using Git yet
   git init
   git add .
   git commit -m "Initial e-commerce setup"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure project:
     - Framework: Next.js
     - Build command: `pnpm build`
     - Install command: `pnpm install`
   
3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

4. **Verify Deployment**
   - Visit your Vercel URL
   - Test authentication
   - Test product browsing
   - Test admin access

### Option 2: Netlify

1. **Build Command**: `pnpm build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Same as Vercel

### Option 3: Self-Hosted (VPS)

```bash
# On your server
git clone your-repo-url
cd your-project
pnpm install
pnpm build

# Using PM2
pm2 start pnpm --name "ecommerce" -- start

# Using systemd
sudo systemctl start ecommerce
```

## Post-Deployment Tasks

### 1. DNS Configuration ✓

- [ ] Point domain to hosting platform
- [ ] Set up www redirect
- [ ] Enable HTTPS/SSL
- [ ] Update Supabase authorized domains

### 2. Supabase Settings ✓

- [ ] Add production URL to "Site URL" in Auth settings
- [ ] Add production URL to "Redirect URLs"
- [ ] Configure email templates (Auth → Email Templates)
- [ ] Set up SMTP for email notifications (optional)

### 3. Create Admin User ✓

```sql
-- In Supabase SQL Editor
-- Update the email to your admin email
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-admin-email@example.com'
);
```

### 4. Performance Optimization ✓

- [ ] Enable Vercel Analytics
- [ ] Set up Vercel Speed Insights
- [ ] Configure image optimization
- [ ] Test page load speeds
- [ ] Enable caching headers

### 5. Monitoring Setup ✓

- [ ] Set up error tracking (Sentry)
- [ ] Configure Supabase database alerts
- [ ] Set up uptime monitoring
- [ ] Enable Vercel logs

## Production Data

### Add Real Products

1. Login to admin dashboard
2. Go to `/admin/products`
3. Add your actual products with:
   - High-quality images
   - Detailed descriptions
   - Accurate pricing in ZMW
   - Correct stock quantities

### Configure Categories

```sql
-- Add your business categories
INSERT INTO categories (name, slug) VALUES
  ('Your Category 1', 'category-1'),
  ('Your Category 2', 'category-2');
```

### Upload Product Images

1. Supabase Dashboard → Storage
2. Create bucket: `products`
3. Set bucket to public
4. Upload images
5. Copy public URLs
6. Use in product management

## Backup Strategy

### Database Backups

1. Supabase automatically backs up daily
2. Manual backup:
   - Dashboard → Database → Backups
   - Click "Create Backup"

### Code Backups

- Ensure code is in Git repository
- Have multiple remotes if possible
- Tag releases: `git tag v1.0.0`

## Rollback Plan

### If Deployment Fails

**Vercel:**
1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

**Database Issues:**
1. Supabase Dashboard → Database → Backups
2. Restore previous backup

## Testing in Production

### Smoke Tests

1. **Home Page**
   - [ ] Loads correctly
   - [ ] CTA buttons work
   - [ ] Navigation works

2. **Shop Page**
   - [ ] Products display
   - [ ] Images load
   - [ ] Add to cart works

3. **Authentication**
   - [ ] Login works
   - [ ] Registration works
   - [ ] Logout works

4. **Admin Dashboard**
   - [ ] Dashboard loads
   - [ ] Product management works
   - [ ] Data displays correctly

### Performance Tests

- [ ] Google PageSpeed Insights score > 90
- [ ] Mobile responsiveness verified
- [ ] All images optimized
- [ ] Time to First Byte < 200ms

## Maintenance Plan

### Weekly Tasks

- [ ] Check Supabase usage/quotas
- [ ] Review error logs
- [ ] Check for security updates
- [ ] Monitor website uptime

### Monthly Tasks

- [ ] Review and optimize database queries
- [ ] Check for Next.js updates
- [ ] Review Supabase costs
- [ ] Backup verification

### Quarterly Tasks

- [ ] Security audit
- [ ] Performance review
- [ ] User feedback review
- [ ] Feature planning

## Support Resources

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

## Emergency Contacts

- Supabase Status: [status.supabase.com](https://status.supabase.com)
- Vercel Status: [vercel-status.com](https://vercel-status.com)

---

**Deployment Complete! 🎉**

Your e-commerce site is now live and ready to accept orders.

Remember to:
- Monitor performance
- Respond to user feedback
- Keep dependencies updated
- Regular backups
- Security patches

Good luck with your business! 🚀
