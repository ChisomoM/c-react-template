# Product Modifiers - Testing Guide

## Overview
This guide will help you test the complete modifiers/add-ons system for products. Follow each checkpoint to verify the implementation.

## Prerequisites
1. Database migration must be run
2. Development server must be running
3. Admin access to the application

---

## Checkpoint 1: Database Schema ✅

### Run the Migration
1. Open your Supabase SQL Editor
2. Copy the contents of `src/scripts/create_modifiers_schema.sql`
3. Execute the SQL script
4. Verify tables created:
   - `modifiers`
   - `product_modifiers`
5. Verify columns added:
   - `cart_items.modifiers` (JSONB)
   - `order_items.modifiers` (JSONB)

### Expected Result
- ✅ Migration runs without errors
- ✅ All tables and columns created
- ✅ RLS policies enabled
- ✅ Indexes created

---

## Checkpoint 2: Create Modifiers (Admin)

### Navigate to Modifiers Management
1. Login as admin
2. Go to **Admin Dashboard** → **Modifiers**
3. Click **"Add Modifier"** button

### Test Case 1: Create Global Modifier
Create a global modifier (available for all products):

**Input:**
- Name: `Gift Wrapping`
- Description: `Beautiful gift wrapping service`
- Price: `15.00` ZMW
- Track Inventory: `OFF` (unchecked)
- Min Quantity: `0`
- Max Quantity: `1`
- Is Global: `ON` (checked)
- Is Active: `ON` (checked)
- Sort Order: `1`

**Expected Result:**
- ✅ Modifier created successfully
- ✅ Toast notification: "Modifier created"
- ✅ Redirected to modifiers list
- ✅ "Gift Wrapping" appears with "Global" badge

### Test Case 2: Create Product-Specific Modifier with Inventory
Create a modifier that tracks inventory:

**Input:**
- Name: `Extra Milk`
- Description: `Additional milk for your drink`
- Price: `5.00` ZMW
- Track Inventory: `ON` (checked)
- Stock Quantity: `50`
- Low Stock Threshold: `10`
- Min Quantity: `0`
- Max Quantity: `3`
- Is Global: `OFF` (unchecked)
- Is Active: `ON` (checked)
- Sort Order: `2`

**Expected Result:**
- ✅ Modifier created successfully
- ✅ Stock fields visible when "Track Inventory" is enabled
- ✅ "Extra Milk" appears in list

### Test Case 3: Create Inactive Modifier

**Input:**
- Name: `Extra Sugar`
- Price: `2.00` ZMW
- Is Active: `OFF` (unchecked)
- Other fields: default values

**Expected Result:**
- ✅ Modifier created
- ✅ "Inactive" badge displayed
- ✅ Not visible to customers (will verify later)

---

## Checkpoint 3: Modifier Management Features

### Test Case 4: Edit Modifier
1. Click on `Extra Milk` in the modifiers list
2. Change price to `6.00` ZMW
3. Change stock to `45`
4. Click **Save**

**Expected Result:**
- ✅ Modifier updated successfully
- ✅ Changes reflected in list
- ✅ Toast notification shown

### Test Case 5: Search Modifiers
1. Type "milk" in the search bar
2. Observe filtered results

**Expected Result:**
- ✅ Only "Extra Milk" is displayed
- ✅ Other modifiers hidden

### Test Case 6: Drag and Drop Sorting
1. Drag "Extra Milk" above "Gift Wrapping"
2. Observe the order change

**Expected Result:**
- ✅ Modifiers reorder visually
- ✅ `sort_order` updates in database
- ✅ Order persists on page refresh

### Test Case 7: Delete Modifier
1. Click delete icon on "Extra Sugar"
2. Confirm deletion in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Modifier deleted after confirmation
- ✅ Removed from list
- ✅ Toast notification shown

---

## Checkpoint 4: Assign Modifiers to Products

### Test Case 8: Create Product with Modifiers
1. Go to **Products** → **Add Product**
2. Fill in product details:
   - Title: `Premium Coffee`
   - Price: `25.00` ZMW
   - Category: Select any
   - Description: Optional
3. Scroll to **Modifiers** section
4. Click **"Select Modifiers"** button
5. In the dialog:
   - Observe "Gift Wrapping" is checked and disabled (global)
   - Check "Extra Milk"
   - Click **Done**
6. Click **Save Product**

**Expected Result:**
- ✅ Dialog shows all active modifiers
- ✅ Global modifiers are pre-selected and disabled
- ✅ Selected modifiers display in the card
- ✅ Product saves with modifier associations
- ✅ Toast: "Product created"

### Test Case 9: Edit Product Modifiers
1. Edit "Premium Coffee" product
2. Open modifier selection dialog
3. Uncheck "Extra Milk"
4. Save product

**Expected Result:**
- ✅ Modifier removed from product
- ✅ Global modifier still present (can't be unchecked)
- ✅ Changes saved successfully

### Test Case 10: Product Without Modifiers
1. Create a product without selecting any modifiers
2. Save it

**Expected Result:**
- ✅ Product created successfully
- ✅ Only global modifiers automatically available
- ✅ Modifiers card shows "No modifiers assigned"

---

## Checkpoint 5: Product Service Fetches Modifiers

### Verify in Browser Console
1. Open browser developer tools (F12)
2. Go to Network tab
3. Navigate to a product details page
4. Check the API response

**Expected Result:**
- ✅ Product data includes `modifiers` array
- ✅ Global modifiers included for all products
- ✅ Product-specific modifiers included if assigned
- ✅ Inactive modifiers excluded

---

## Checkpoint 6: Customer-Facing UI (Future)

**Status:** Not yet implemented

### Will Include:
- Modifier selection on product details page
- Quantity controls for each modifier
- Live price calculation
- Min/max quantity enforcement
- Stock availability display

---

## Checkpoint 7: Cart Integration (Future)

**Status:** Not yet implemented

### Will Include:
- Selected modifiers saved to cart
- Modifiers displayed as sub-items
- Price breakdown showing modifier costs
- Stock deduction on order placement

---

## Checkpoint 8: Order Management (Future)

**Status:** Not yet implemented

### Will Include:
- Orders show modifier details
- Modifier stock management
- Order history with modifiers

---

## Database Verification Queries

### Check Modifiers Table
```sql
SELECT id, name, price_zmw, is_global, is_active, track_inventory, stock_quantity 
FROM modifiers 
ORDER BY sort_order;
```

### Check Product-Modifier Associations
```sql
SELECT 
  p.title AS product_name,
  m.name AS modifier_name,
  m.price_zmw,
  m.is_global
FROM product_modifiers pm
JOIN products p ON p.id = pm.product_id
JOIN modifiers m ON m.id = pm.modifier_id
ORDER BY p.title, pm.sort_order;
```

### Check Cart Items with Modifiers
```sql
SELECT 
  ci.id,
  p.title AS product,
  ci.quantity,
  ci.modifiers::text
FROM cart_items ci
JOIN products p ON p.id = ci.product_id
WHERE ci.modifiers IS NOT NULL;
```

---

## Common Issues & Solutions

### Issue 1: Migration Fails
**Solution:** 
- Check if tables already exist
- Use `DROP TABLE IF EXISTS` commands first
- Verify Supabase connection

### Issue 2: Modifiers Not Showing in Product Form
**Solution:**
- Check if modifiers are marked as `is_active = true`
- Verify RLS policies allow SELECT access
- Check browser console for errors

### Issue 3: Global Modifier Can't Be Unchecked
**Behavior:** This is intentional - global modifiers are automatically available for all products

### Issue 4: Drag-Drop Not Working
**Solution:**
- Ensure you're dragging by the row, not buttons
- Check that `sort_order` column exists
- Verify update permissions in database

---

## Success Criteria

**Admin Functionality:**
- ✅ Create modifiers (global and product-specific)
- ✅ Edit modifiers
- ✅ Delete modifiers
- ✅ Search modifiers
- ✅ Drag-drop sorting
- ✅ Inventory tracking (optional)
- ✅ Assign modifiers to products
- ✅ Remove modifiers from products
- ✅ Global modifiers auto-assigned

**Database:**
- ✅ Schema created without errors
- ✅ RLS policies working
- ✅ Indexes created for performance

**Next Steps:**
- [ ] Implement customer product details page UI
- [ ] Add modifier selection to cart
- [ ] Calculate prices with modifiers
- [ ] Stock deduction on order
- [ ] Display modifiers in orders

---

## Notes
- All prices are in Zambian Kwacha (ZMW)
- Stock is optional (controlled by `track_inventory` flag)
- Min/Max quantities enforce ordering limits
- Global modifiers cannot be removed from products
- Inactive modifiers are hidden from customers
- Sort order determines display sequence

