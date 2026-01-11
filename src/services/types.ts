// Service Layer Interfaces (Contracts)

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role?: 'admin' | 'customer'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone?: string
}

export interface Product {
  id: string
  title: string
  description: string
  price_zmw: number
  cost_price_zmw?: number
  sku?: string
  stock_quantity: number
  low_stock_threshold?: number
  track_inventory?: boolean
  category_id?: string
  images: string[]
  is_active?: boolean
  created_at?: string
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  size?: string
  color?: string
  stock_quantity: number
  sku?: string
  cost_price_zmw?: number
  stock_adjustment?: number // Deprecated, kept for compat
}

export interface InventoryLog {
  id: string
  product_id: string
  variant_id?: string
  change_amount: number
  final_stock: number
  reason: 'order' | 'restock' | 'correction' | 'return' | 'initial'
  note?: string
  created_by?: string
  created_at: string
  product?: Product
  variant?: ProductVariant
  user_email?: string // For display
}

export interface Combo {
  id: string
  title: string
  description: string
  discount_percentage: number
  is_active: boolean
  price_zmw?: number
  stock_quantity?: number
  images?: string[]
  items?: ComboItem[]
}

export interface ComboItem {
  id: string
  combo_id: string
  product_id: string
  product?: Product
}

export interface CartItem {
  id?: string
  product_id: string
  quantity: number
  name?: string
  price?: number
  image_url?: string
  stock_quantity?: number
  variant_selection?: {
    size?: string
    color?: string
  }
  product?: Product
}

export interface ShippingAddress {
  first_name: string
  last_name: string
  address: string
  area?: string // Added for analytics
  city: string
  phone: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  total_zmw: number
  payment_method: string
  shipping_address: ShippingAddress
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  price_at_purchase: number
  variant_selection?: any
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<User>
  register(data: RegisterData): Promise<User>
  logout(): Promise<void>
  getUser(): Promise<User | null>
}

export interface IProductService {
  getProducts(category?: string): Promise<Product[]>
  getAdminProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  search(query: string): Promise<Product[]>
  createProduct(product: Partial<Product>): Promise<Product>
  updateProduct(id: string, product: Partial<Product>): Promise<Product>
  deleteProduct(id: string): Promise<void>
  adjustStock(productId: string, variantId: string | null, amount: number, reason: string, note?: string): Promise<void>
  getInventoryLogs(limit?: number): Promise<InventoryLog[]>
  getLowStockProducts(): Promise<Product[]>
}

export interface IComboService {
  getCombos(): Promise<Combo[]>
  getCombo(id: string): Promise<Combo | null>
}

export interface IOrderService {
  createOrder(order: Omit<Order, 'id' | 'created_at' | 'status' | 'user_id' | 'items'> & { items: Omit<OrderItem, 'id' | 'order_id'>[] }): Promise<Order>
  getOrders(): Promise<Order[]>
  getOrder(id: string): Promise<Order | null>
}

export interface ICartService {
  addItem(item: CartItem): Promise<void>
  removeItem(productId: string): Promise<void>
  sync(): Promise<CartItem[]>
}

export interface Branch {
  id: string
  name: string
  location?: string
  phone?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface BranchStaff {
  id: string
  branch_id: string
  user_id: string
  role: string
  permissions: string[]
  user?: User 
  branch?: Branch
}

export interface BranchInventory {
  id: string
  branch_id: string
  product_id: string
  variant_id?: string
  quantity: number
  updated_at: string
}

export interface IBranchService {
  getBranches(): Promise<Branch[]>
  getBranch(id: string): Promise<Branch | null>
  createBranch(branch: Partial<Branch>): Promise<Branch>
  updateBranch(id: string, branch: Partial<Branch>): Promise<Branch>
  deleteBranch(id: string): Promise<void>
  
  getBranchStaff(branchId: string): Promise<BranchStaff[]>
  assignStaff(branchId: string, email: string, role: string, permissions: string[]): Promise<BranchStaff>
  removeStaff(branchId: string, userId: string): Promise<void>
  updateStaffPermissions(branchId: string, userId: string, permissions: string[]): Promise<BranchStaff>

  getBranchInventory(branchId: string, productId: string): Promise<BranchInventory[]>
  updateBranchStock(branchId: string, productId: string, variantId: string | undefined | null, quantity: number): Promise<void>
}


