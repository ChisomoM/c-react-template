'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { SupabaseProductService } from '@/services/SupabaseProductService'
import { Product } from '@/services/types'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/lib/context/cart'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  const productService = new SupabaseProductService()
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'accessories', name: 'Accessories' },
  ]

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'newest', name: 'Newest First' },
  ]

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const data = await productService.getProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load products'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        (p as any).categories?.slug === selectedCategory ||
        p.title?.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price_zmw - b.price_zmw)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price_zmw - a.price_zmw)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
      default:
        // Keep original order for 'featured'
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy])

  // Handle URL query params
  useEffect(() => {
    const category = searchParams?.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem({
        product_id: productId,
        quantity: 1,
      })
    } catch (error) {
      // Error is already handled by the cart context
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-96 bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-sora font-bold text-5xl md:text-6xl text-charcoal mb-4 tracking-tight">
            Shop Collection
          </h1>
          <p className="font-sora font-light text-lg text-gray-600">
            Discover our curated selection of Luxury
          </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-300">
            {/* Category Filters - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-4 py-2 font-sora font-medium text-sm tracking-wide
                    transition-all duration-300 rounded-none
                    ${selectedCategory === category.id
                      ? 'bg-gold-primary text-charcoal'
                      : 'text-gray-600 hover:text-charcoal hover:bg-cream'
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 text-charcoal font-sora font-medium text-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  className="w-full md:w-auto appearance-none px-4 py-2 pr-10 border border-gray-300 bg-white text-charcoal font-sora font-medium text-sm focus:outline-none focus:border-gold-primary transition-colors cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Results Count */}
            <div className="font-sora font-light text-sm text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>
          </div>

          {/* Mobile Category Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 p-4 bg-cream border border-gray-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sora font-semibold text-sm text-charcoal">Categories</h3>
                <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setShowFilters(false)
                    }}
                    className={`
                      w-full text-left px-4 py-3 font-sora font-medium text-sm
                      transition-all duration-300
                      ${selectedCategory === category.id
                        ? 'bg-gold-primary text-charcoal'
                        : 'text-gray-600 hover:text-charcoal hover:bg-white'
                      }
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="font-sora font-semibold text-2xl text-charcoal mb-2">
              No products found
            </h3>
            <p className="font-sora font-light text-gray-600 mb-8">
              Try adjusting your filters or check back later for new arrivals
            </p>
            <Button
              onClick={() => setSelectedCategory('all')}
              className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none"
            >
              View All Products
            </Button>
          </motion.div>
        ) : (
          <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                delay={idx * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({
  product,
  onAddToCart,
  delay,
}: {
  product: Product
  onAddToCart: (id: string) => void
  delay: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Use actual images from the folder, fallback to placeholder
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0]
    }
    // Use actual images based on product type
    const title = product.title?.toLowerCase() || ''
    if (title.includes('suit')) return '/images/suit-hero.jpg'
    if (title.includes('shoe')) return '/images/shoe 1.png'
    if (title.includes('shirt')) return '/images/shirt 1.png'
    if (title.includes('jean')) return '/images/jean 1.png'
    if (title.includes('hat')) return '/images/hat1.png'
    if (title.includes('kid')) return '/images/kids.png'
    if (title.includes('women') || title.includes('lady')) return '/images/lady1.png'
    return '/images/shirt 1.png' // default fallback
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-cream mb-4">
          <Image
            src={getProductImage()}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
              <span className="font-sora font-semibold text-white text-sm px-4 py-2 bg-charcoal">
                Out of Stock
              </span>
            </div>
          )}
          {product.stock_quantity > 0 && product.stock_quantity < 5 && (
            <div className="absolute top-4 right-4 bg-gold-primary text-charcoal px-3 py-1 font-sora font-semibold text-xs">
              Low Stock
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2">
        <Link href={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <h3 className="font-sora font-semibold text-lg text-charcoal group-hover:text-gold-dark transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        
        <p className="font-sora font-light text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="font-sora font-bold text-xl text-charcoal">
            K{product.price_zmw.toFixed(2)}
          </span>
          {product.stock_quantity > 0 && (
            <span className="font-sora font-light text-xs text-gold-dark">
              {product.stock_quantity} in stock
            </span>
          )}
        </div>

        <Button
          onClick={() => onAddToCart(product.id)}
          disabled={product.stock_quantity === 0}
          className={`
            w-full mt-3 rounded-none font-sora font-semibold text-sm
            transition-all duration-300
            ${product.stock_quantity === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-charcoal hover:bg-gold-primary text-white hover:text-charcoal hover:shadow-[0_0_20px_rgba(230,184,0,0.3)]'
            }
          `}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  )
}