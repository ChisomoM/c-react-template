'use client'

import { useEffect, useState, use, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SupabaseProductService } from '@/services/SupabaseProductService'
import { Product, ProductVariant } from '@/services/types'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/context/cart'
import { toast } from 'sonner'
import { 
  Loader2, Minus, Plus, ShoppingCart, Heart, Share2, 
  Truck, Shield, RotateCcw, X, ZoomIn, Play, ChevronDown,
  Bell, Check, Sparkles, TrendingUp, Award, Clock
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [playingVideo, setPlayingVideo] = useState(false)
  
  const productService = new SupabaseProductService()
  const { addItem } = useCart()
  const router = useRouter()
  
  const detailsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isDetailsInView = useInView(detailsRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        // Get all products and find by slug
        const products = await productService.getProducts()
        const foundProduct = products.find(p => 
          p.title.toLowerCase().replace(/\s+/g, '-') === slug
        )
        
        if (!foundProduct) {
          toast.error('Product not found')
          router.push('/shop')
          return
        }
        
        setProduct(foundProduct)
        
        // Set default selections
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          const colors = [...new Set(foundProduct.variants.map(v => v.color).filter(Boolean))]
          const sizes = [...new Set(foundProduct.variants.map(v => v.size).filter(Boolean))]
          
          if (colors.length > 0) setSelectedColor(colors[0] as string)
          if (sizes.length > 0) setSelectedSize(sizes[0] as string)
        }
      } catch (error) {
        toast.error('Failed to load product')
        router.push('/shop')
      } finally {
        setIsLoading(false)
      }
    }
    loadProduct()
  }, [slug, router])

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

    // Find selected variant
    const selectedVariant = product.variants?.find(
      v => v.color === selectedColor && v.size === selectedSize
    )

    try {
      setIsAddingToCart(true)
      await addItem({
        product_id: product.id,
        quantity: quantity,
        variant_selection: {
          color: selectedColor || undefined,
          size: selectedSize || undefined,
        },
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

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push('/checkout')
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
    setShowZoom(true)
  }

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('You will be notified when this item is back in stock')
    setShowNotifyModal(false)
    setNotifyEmail('')
  }

  // Get available colors and sizes
  const availableColors = product?.variants 
    ? [...new Set(product.variants.map(v => v.color).filter(Boolean))]
    : []
  
  const availableSizes = product?.variants
    ? [...new Set(product.variants.map(v => v.size).filter(Boolean))]
    : []

  // Get current stock based on selection
  const getCurrentStock = () => {
    if (!product) return 0
    
    if (selectedColor || selectedSize) {
      const variant = product.variants?.find(
        v => v.color === selectedColor && v.size === selectedSize
      )
      return variant?.stock_quantity || 0
    }
    
    return product.stock_quantity
  }

  const currentStock = getCurrentStock()

  // Status badges
  const getStatusBadges = () => {
    const badges = []
    
    // Mock data for demonstration - replace with actual product fields
    if (product?.created_at) {
      const createdDate = new Date(product.created_at)
      const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceCreation < 30) {
        badges.push({ label: 'New Arrival', icon: Sparkles, color: 'bg-gold-primary' })
      }
    }
    
    // Sale badge (mock - add discount field to product)
    if (product?.cost_price_zmw && product.price_zmw < product.cost_price_zmw) {
      const discount = Math.round(((product.cost_price_zmw - product.price_zmw) / product.cost_price_zmw) * 100)
      badges.push({ label: `${discount}% Off`, icon: TrendingUp, color: 'bg-red-600' })
    }
    
    // Low stock warning
    if (currentStock > 0 && currentStock <= (product?.low_stock_threshold || 10)) {
      badges.push({ label: 'Low Stock', icon: Clock, color: 'bg-orange-600' })
    }
    
    // Out of stock
    if (currentStock === 0) {
      badges.push({ label: 'Out of Stock', icon: X, color: 'bg-gray-600' })
    }
    
    return badges
  }

  const statusBadges = getStatusBadges()

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200"></div>
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

  // Mock video URL - add video_url field to product type if needed
  const productVideo = null // product.video_url

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Main Image/Video */}
            <div 
              ref={imageRef}
              className="relative aspect-square overflow-hidden bg-cream cursor-zoom-in"
              onMouseMove={handleImageZoom}
              onMouseLeave={() => setShowZoom(false)}
              onClick={() => setShowZoom(!showZoom)}
            >
              {productVideo && playingVideo ? (
                <video 
                  src={productVideo}
                  controls 
                  autoPlay
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <>
                  <Image
                    src={displayImages[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300"
                    style={showZoom ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                    } : undefined}
                    priority
                  />
                  
                  {/* Zoom indicator */}
                  {!showZoom && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3">
                      <ZoomIn className="h-5 w-5 text-charcoal" />
                    </div>
                  )}
                </>
              )}
              
              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {statusBadges.map((badge, idx) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${badge.color} text-white px-4 py-2 font-sora font-semibold text-xs flex items-center gap-2`}
                  >
                    <badge.icon className="h-4 w-4" />
                    {badge.label}
                  </motion.div>
                ))}
              </div>

              {/* Action Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWishlist}
                  className="bg-white/90 backdrop-blur-sm p-3 hover:bg-gold-primary transition-all duration-300 group"
                  aria-label="Add to wishlist"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      isWishlisted 
                        ? 'fill-gold-primary text-gold-primary' 
                        : 'text-charcoal group-hover:text-white'
                    }`} 
                  />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="bg-white/90 backdrop-blur-sm p-3 hover:bg-gold-primary transition-all duration-300 group"
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5 text-charcoal group-hover:text-white transition-colors" />
                </motion.button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {displayImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setSelectedImage(idx)
                    setPlayingVideo(false)
                  }}
                  className={`relative aspect-square overflow-hidden bg-cream transition-all duration-300 ${
                    selectedImage === idx && !playingVideo
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
                </motion.button>
              ))}
              
              {/* Video thumbnail if exists */}
              {productVideo && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setPlayingVideo(true)}
                  className={`relative aspect-square overflow-hidden bg-charcoal transition-all duration-300 flex items-center justify-center ${
                    playingVideo ? 'ring-2 ring-gold-primary' : ''
                  }`}
                  aria-label="Play product video"
                >
                  <Play className="h-8 w-8 text-white" />
                </motion.button>
              )}
            </div>
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
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-sora font-bold text-3xl text-gold-dark">
                  K{product.price_zmw.toFixed(2)}
                </span>
                {product.cost_price_zmw && product.price_zmw < product.cost_price_zmw && (
                  <span className="font-sora font-light text-xl text-gray-600 line-through">
                    K{product.cost_price_zmw.toFixed(2)}
                  </span>
                )}
              </div>
              
              <p className="font-sora font-light text-base leading-relaxed text-gray-900">
                {product.description || "Elevate your wardrobe with this premium piece."}
              </p>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="pb-6 border-b border-gray-300">
                <label className="font-sora font-semibold text-sm text-charcoal mb-3 block">
                  Color: <span className="font-light text-gray-600">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {availableColors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color as string)}
                      className={`h-12 w-12 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color 
                          ? 'border-gold-primary ring-2 ring-gold-light' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color?.toLowerCase() }}
                      aria-label={`Select ${color} color`}
                    >
                      {selectedColor === color && (
                        <Check className="h-6 w-6 text-white mx-auto" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="pb-6 border-b border-gray-300">
                <label className="font-sora font-semibold text-sm text-charcoal mb-3 block">
                  Size: <span className="font-light text-gray-600">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {availableSizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size as string)}
                      className={`px-6 py-3 font-sora font-medium text-sm border-2 transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-gold-primary bg-gold-primary text-charcoal'
                          : 'border-gray-300 text-gray-900 hover:border-charcoal'
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4">
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
                    disabled={quantity >= currentStock}
                    className="px-4 py-3 hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 text-charcoal" />
                  </button>
                </div>
                <span className="font-sora font-light text-sm text-gray-600">
                  {currentStock} available
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={currentStock < 1 || isAddingToCart}
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
                
                <Button
                  onClick={handleBuyNow}
                  disabled={currentStock < 1 || isAddingToCart}
                  className="w-full bg-charcoal hover:bg-gold-primary text-white hover:text-charcoal font-sora font-semibold text-base px-8 py-6 rounded-none transition-all duration-300"
                >
                  Buy Now
                </Button>
              </div>

              {/* Out of stock notification */}
              {currentStock === 0 && (
                <Button
                  onClick={() => setShowNotifyModal(true)}
                  variant="outline"
                  className="w-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-sora font-semibold rounded-none"
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Notify When Available
                </Button>
              )}
            </div>

            {/* Accordions */}
            <Accordion type="multiple" className="w-full">
              {/* Delivery Information */}
              <AccordionItem value="delivery" className="border-gray-300">
                <AccordionTrigger className="font-sora font-semibold text-charcoal hover:text-gold-dark">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery & Returns
                  </div>
                </AccordionTrigger>
                <AccordionContent className="font-sora font-light text-gray-900 space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-gold-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Free Delivery</h4>
                      <p className="text-sm">On orders over K500 within Lusaka. Standard delivery takes 2-3 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw className="h-5 w-5 text-gold-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Easy Returns</h4>
                      <p className="text-sm">14-day return policy on all items. Items must be unworn with tags attached.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-gold-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Secure Payment</h4>
                      <p className="text-sm">100% secure and encrypted transactions. We accept all major payment methods.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Product Specifications - Conditional */}
              {(product.sku || availableColors.length > 0 || availableSizes.length > 0) && (
                <AccordionItem value="specifications" className="border-gray-300">
                  <AccordionTrigger className="font-sora font-semibold text-charcoal hover:text-gold-dark">
                    Product Specifications
                  </AccordionTrigger>
                  <AccordionContent className="font-sora font-light text-gray-900 pt-4">
                    <dl className="space-y-3">
                      {product.sku && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <dt className="font-medium">SKU:</dt>
                          <dd className="text-gray-600">{product.sku}</dd>
                        </div>
                      )}
                      {availableColors.length > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <dt className="font-medium">Available Colors:</dt>
                          <dd className="text-gray-600">{availableColors.join(', ')}</dd>
                        </div>
                      )}
                      {availableSizes.length > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <dt className="font-medium">Available Sizes:</dt>
                          <dd className="text-gray-600">{availableSizes.join(', ')}</dd>
                        </div>
                      )}
                      <div className="flex justify-between py-2">
                        <dt className="font-medium">Stock Status:</dt>
                        <dd className={currentStock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </dd>
                      </div>
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </motion.div>
        </div>
      </div>

      {/* Notify Modal */}
      <AnimatePresence>
        {showNotifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-sora font-bold text-2xl text-charcoal">Get Notified</h3>
                <button 
                  onClick={() => setShowNotifyModal(false)}
                  className="text-gray-600 hover:text-charcoal transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="font-sora font-light text-gray-600 mb-6">
                Enter your email and we'll notify you when {product.title} is back in stock.
              </p>
              
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 font-sora focus:outline-none focus:border-gold-primary transition-colors"
                />
                <Button
                  type="submit"
                  className="w-full bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none"
                >
                  Notify Me
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
