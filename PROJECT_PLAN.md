# E-commerce Transformation Plan

## 1. Architecture & Tech Stack
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Frontend:** Next.js 15 (App Router), React 18, Tailwind, Radix UI
- **Pattern:** Service Layer Abstraction (Repository Pattern) to decouple UI from Supabase.
- **Payment:** Mocked ZMW (Mobile Money Simulation).
- **Region:** Zambia (ZMW currency, Phone Auth emphasis).

## 2. Implementation Phases

### Phase 1: Foundation & Abstraction
*Goal: Establish the core infrastructure and decouple the backend.*
- [ ] **Supabase Initialization**:
    - Setup `src/lib/supabase/client.ts` (Singleton).
    - Create `src/lib/supabase/server.ts` (for server components).
    - Configure Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [ ] **Service Layer Interfaces (The Contract)**:
    - Define interfaces in `src/services/types.ts`:
        - `IAuthService`: Login, Register, Logout, GetUser.
        - `IProductService`: GetProducts, GetProduct, Search.
        - `ICartService`: AddItem, RemoveItem, Sync.
- [ ] **Auth Migration**:
    - Implement `SupabaseAuthService` class implementing `IAuthService`.
    - Refactor `src/lib/context/auth.tsx` to use `SupabaseAuthService`.
    - Ensure `useAuth()` hook remains compatible with existing components.

### Phase 2: Database Schema & Logic
*Goal: Design a robust schema to support standard items and bundles.*
- [ ] **Tables Migration**:
    - `profiles`: `id` (FK to auth.users), `first_name`, `last_name`, `phone`, `role` (admin/customer).
    - `categories`: `id`, `name`, `slug`, `parent_id`.
    - `products`: `id`, `title`, `description`, `price_zmw`, `stock_quantity`, `category_id`, `images` (array).
    - `product_variants`: `id`, `product_id`, `size`, `color`, `stock_adjustment`.
    - `combos`: `id`, `title`, `description`, `discount_percentage`, `is_active`.
    - `combo_items`: `id`, `combo_id`, `product_id`.
    - `orders`: `id`, `user_id`, `status` (pending, paid, shipped, delivered), `total_zmw`, `shipping_address` (json).
    - `order_items`: `id`, `order_id`, `product_id`, `price_at_purchase`, `quantity`, `variant_selection`.
- [ ] **Seeding (Specific Requirement)**:
    - Create `src/scripts/seed_data.sql` with:
        - 1 Shirt, 1 Jean, 1 Suit, 1 Pair of Shoes, 1 Hat.
        - 1 Combo: "The Gentleman's Starter Pack" (Suit + Shoes).

### Phase 3: Admin Dashboard (Priority)
*Goal: Build the management interface first as the source of truth.*
- [ ] **Admin Structure**:
    - Ensure `(admin)/layout.tsx` enforces `admin` role check via AuthService.
    - Create Sidebar Navigation (Dashboard, Products, Orders, Users).
- [ ] **Product Management (CRUD)**:
    - Product List Table with Image previews.
    - "Add Product" Wizard:
        - Step 1: Basic Info (Title, Price).
        - Step 2: Variants (Size/Color matrix).
        - Step 3: Image Upload (Supabase Storage bucket `products`).
- [ ] **Combo Builder**:
    - Interface to select multiple existing products and define a discount.
- [ ] **Internal Analytics**:
    - **Sales Chart**: Bar chart showing Orders grouped by date (last 30 days).
    - **Inventory Report**: Table filtering products where `stock_quantity < 5`.
    - **Geo Report**: List of Purchase Locations (from Address data).

### Phase 4: Customer Storefront
*Goal: A generic but polished shopping experience reflecting the Admin data.*
- [ ] **Catalog Pages**:
    - Refactor `(public)/page.tsx` to fetch featured products.
    - create `(public)/shop/page.tsx` with Sidebar Filters (Category, Price Range).
    - create `(public)/shop/[slug]/page.tsx` (Product Detail).
        - Variant Logic: User selects "Red" -> "XL" becomes disabled if OOS.
- [ ] **Cart System**:
    - Implement `CartContext` using `CartService`.
    - Logic: Sync local cart to `cart_items` table upon login.
- [ ] **Mock Checkout Flow**:
    - **Step 1: Identity**: Guest (Email capture) or Login.
    - **Step 2: Shipping**: Address Form.
    - **Step 3: Payment (Mock)**:
        - Option: "Mobile Money".
        - Input: Phone Number.
        - Button "Pay".
        - **Simulation**: Loading spinner (2s) -> Success.
    - **Step 4: Order Creation**:
        - POST to `orders` table.
        - Trigger DB function to decrement stock.
    - **Step 5: Confirmation**: "Order #1234 Placed".

### Phase 5: User Account Features
*Goal: Enable customer retention and self-service.*
- [ ] **Profile Management**:
    - Form to update Name/Phone in \`(public)/account/profile\`.
- [ ] **Order History**:
    - List view of past orders with Status badges (Pending, Delivered) in \`(public)/account/orders\`.
- [ ] **Wishlist**:
    - Toggle heart icon on product cards.
    - Wishlist page at \`(public)/wishlist\`.

### Phase 6: Refinement
- [ ] **Mobile Optimization**: Check tap targets and responsive grids.
- [ ] **Performance**: Implement image optimization (Next/Image with Supabase Loader).
