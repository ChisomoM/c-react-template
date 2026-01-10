'use client'

import { useEffect, useState, use, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { SupabaseProductService } from '@/services/SupabaseProductService'
import { Product } from '@/services/types'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/context/cart'
import { toast } from 'sonner'
import { Loader2, Minus, Plus, ShoppingCart, ChevronRight, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const productService = new SupabaseProductService()
  const { addItem } = useCart()
  const router = useRouter()
  
  const detailsRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)
  const isDetailsInView = useInView(detailsRef, { once: true, margin: '-100px' })
  const isRelatedInView = useInView(relatedRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const data = await productService.getProduct(id)
        setProduct(data)
        
        // Load related products (same category)
        if (data.category) {
          const products = await productService.getProducts()
          const related = products
            .filter(p => p.category === data.category && p.id !== data.id)
            .slice(0, 4)
          setRelatedProducts(related)
        }
      } catch (error) {
        toast.error('Failed to load product')
        router.push('/shop')
      } finally {
        setIsLoading(false)
      }
    }
    loadProduct()
  }, [id, router])

  // Smart image fallback
  const getProductImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0]
    }
    
    const title = product.title.toLowerCase()
    if (title.includes('suit')) return '/images/suit-hero.jpg'
    if (title.includes('shoe')) return '/images/shoe 1.png'
    if (title.includes('shirt')) return '/images/shirt 1.png'
    if (title.includes('jean') || title.includes('pants')) return '/images/jean 1.png'
    if (title.includes('hat')) return '/images/hat1.png'
    if (title.includes('kid')) return '/images/kids.png'
    if (title.includes('women') || title.includes('lady')) return '/images/lady1.png'
    
    return '/images/suit-hero.jpg'
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setIsAddingToCart(true)
      await addItem({
        product_id: product.id,
        quantity: quantity,
        variant_selection: {},
      })
      toast.success('Added to cart', {
        description: `${quantity} × ${product.title}`,
      })
    } catch (error) {
      // Error handled in context
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-pulse">
            {/* Breadcrumbs skeleton */}
            <div className="h-4 bg-gray-200 w-48 mb-12"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-[4/5] bg-gray-200"></div>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 w-24 bg-gray-200"></div>
                  ))}
                </div>
              </div>
              
              {/* Details skeleton */}
              <div className="space-y-6">
                <div className="h-12 bg-gray-200 w-3/4"></div>
                <div className="h-8 bg-gray-200 w-32"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 w-full"></div>
                  <div className="h-4 bg-gray-200 w-5/6"></div>
                  <div className="h-4 bg-gray-200 w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : [getProductImage(product)]

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-12 font-sora text-sm text-gray-600"
        >
          <Link href="/" className="hover:text-gold-dark transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/shop" className="hover:text-gold-dark transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-charcoal font-medium">{product.title}</span>
        </motion.nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-cream">
              <Image
                src={displayImages[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Stock Badge */}
              {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                <div className="absolute top-4 left-4 bg-gold-primary text-charcoal px-4 py-2 font-sora font-semibold text-xs">
                  Only {product.stock_quantity} Left
                </div>
              )}
              
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-charcoal/80 flex items-center justify-center">
                  <span className="font-sora font-bold text-2xl text-white">Out of Stock</span>
                </div>
              )}

              {/* Action Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button 
                  className="bg-white/90 backdrop-blur-sm p-3 hover:bg-gold-primary transition-all duration-300 group"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-5 w-5 text-charcoal group-hover:text-white transition-colors" />
                </button>
                <button 
                  className="bg-white/90 backdrop-blur-sm p-3 hover:bg-gold-primary transition-all duration-300 group"
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5 text-charcoal group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square overflow-hidden bg-cream transition-all duration-300 ${
                      selectedImage === idx 
                        ? 'ring-2 ring-gold-primary' 
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.title} ${idx + 1}`} 
                      fill 
                      className="object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            ref={detailsRef}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Title & Price */}
            <div>
              <h1 className="font-sora font-bold text-4xl md:text-5xl text-charcoal mb-4 tracking-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="font-sora font-bold text-3xl text-gold-dark">
                  K{product.price_zmw.toFixed(2)}
                </span>
                {product.discount && (
                  <span className="font-sora font-light text-xl text-gray-600 line-through">
                    K{(product.price_zmw * 1.2).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-gray-300">
              <p className="font-sora font-light text-base leading-relaxed text-gray-900">
                {product.description || "Elevate your wardrobe with this premium piece. Crafted with attention to detail and designed for the modern individual who appreciates quality and style."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="font-sora font-semibold text-sm text-charcoal">Quantity:</span>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-3 hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 text-charcoal" />
                  </button>
                  <span className="w-16 text-center font-sora font-semibold text-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock_quantity}
                    className="px-4 py-3 hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 text-charcoal" />
                  </button>
                </div>
                <span className="font-sora font-light text-sm text-gray-600">
                  {product.stock_quantity} available
                </span>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity < 1 || isAddingToCart}
                className="w-full bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold text-base px-8 py-6 rounded-none transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,184,0,0.4)]"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="pt-8 border-t border-gray-300 space-y-4">
              <div className="flex items-start gap-4">
                <Truck className="h-6 w-6 text-gold-dark flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-sora font-semibold text-charcoal mb-1">Free Delivery</h3>
                  <p className="font-sora font-light text-sm text-gray-600">
                    On orders over K500 within Lusaka
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-gold-dark flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-sora font-semibold text-charcoal mb-1">Secure Payment</h3>
                  <p className="font-sora font-light text-sm text-gray-600">
                    100% secure and encrypted transactions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <RotateCcw className="h-6 w-6 text-gold-dark flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-sora font-semibold text-charcoal mb-1">Easy Returns</h3>
                  <p className="font-sora font-light text-sm text-gray-600">
                    14-day return policy on all items
                  </p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            {product.category && (
              <div className="pt-8 border-t border-gray-300">
                <div className="flex items-center gap-2 font-sora text-sm">
                  <span className="text-gray-600">Category:</span>
                  <Link 
                    href={`/shop?category=${product.category}`}
                    className="text-charcoal font-semibold hover:text-gold-dark transition-colors"
                  >
                    {product.category}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section ref={relatedRef} className="mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isRelatedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="font-sora font-bold text-3xl md:text-4xl text-charcoal text-center mb-4 tracking-tight">
                You May Also Like
              </h2>
              <p className="font-sora font-light text-center text-gray-600">
                Curated selections from the same collection
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, idx) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isRelatedInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="group"
                >
                  <Link href={`/product/${relatedProduct.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-cream mb-4">
                      <Image
                        src={getProductImage(relatedProduct)}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {relatedProduct.stock_quantity <= 10 && relatedProduct.stock_quantity > 0 && (
                        <div className="absolute top-2 left-2 bg-gold-primary text-charcoal px-3 py-1 font-sora font-semibold text-xs">
                          Low Stock
                        </div>
                      )}
                    </div>
                    <h3 className="font-sora font-semibold text-lg text-charcoal group-hover:text-gold-dark transition-colors mb-2">
                      {relatedProduct.title}
                    </h3>
                    <p className="font-sora font-bold text-gold-dark">
                      K{relatedProduct.price_zmw.toFixed(2)}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
