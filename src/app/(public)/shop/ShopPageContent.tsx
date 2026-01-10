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

export default function ShopPageContent() {
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

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price_zmw || 0) - (b.price_zmw || 0))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.price_zmw || 0) - (a.price_zmw || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
      default:
        // Keep original order for featured
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy])

  const handleAddToCart = async (product: Product) => {
    try {
      if (product.stock_quantity === 0) {
        toast.error('This product is out of stock')
        return
      }

      await addItem({
        product_id: product.id,
        name: product.title,
        price: product.price_zmw || 0,
        quantity: 1,
        image_url: product.images?.[0] || '',
        stock_quantity: product.stock_quantity || 0,
      })

      toast.success('Added to cart!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add to cart'
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Shop Our Collection</h1>
          <p className="text-xl mb-8">Discover the latest trends and premium quality products</p>
        </div>
      </motion.section>

      {/* Filters and Sort */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Category:</span>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and Filters Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ZMW {product.price_zmw?.toFixed(2)}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-1" />
                      {product.stock_quantity} in stock
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}