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
  stock_quantity: number
  category_id?: string
  images: string[]
  is_active?: boolean
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  size?: string
  color?: string
  stock_adjustment: number
}

export interface CartItem {
  product_id: string
  quantity: number
  variant_selection?: {
    size?: string
    color?: string
  }
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<User>
  register(data: RegisterData): Promise<User>
  logout(): Promise<void>
  getUser(): Promise<User | null>
}

export interface IProductService {
  getProducts(category?: string): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  search(query: string): Promise<Product[]>
}

export interface ICartService {
  addItem(item: CartItem): Promise<void>
  removeItem(productId: string): Promise<void>
  sync(): Promise<CartItem[]>
}