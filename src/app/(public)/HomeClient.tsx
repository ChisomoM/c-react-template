'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Footer } from '@/components/footer'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomeClient() {
  const scrollProgressRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  // Scroll progress indicator - inline style needed for dynamic animation
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (scrollProgressRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (scrollProgressRef.current as any).style.transform = `scaleX(${latest})`
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  // Hero parallax effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-image', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gray-300 z-50">
        <div
          ref={scrollProgressRef}
          className="h-full bg-gold-primary origin-left scale-x-0"
        />
      </div>

      {/* Hero Grid Section */}
      <HeroGrid />

      {/* Shop by Category Section */}
      <ShopByCategory />

      {/* Curated Collections Section */}
      <CuratedCollections />

      {/* Brand Story Section */}
      <BrandStory />

      {/* Video Section */}
      <VideoSection />      
    </div>
  )
}

// Hero Grid Component
function HeroGrid() {
  const [currentHero, setCurrentHero] = useState(0)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const heroSectionRef = useRef<HTMLDivElement>(null)

  const heroImages = [
    {
      image: '/images/suit-hero.jpg', // Replace with actual image
      title: 'Redefine Your Wardrobe',
      subtitle: 'Curated collections for the modern, elegant lifestyle',
      cta: 'Explore Collection',
    },
    {
      image: '/images/shoe 3.png', // Replace with actual image
      title: 'Step Into Elegance',
      subtitle: 'Premium footwear that commands attention',
      cta: 'Shop Footwear',
    },
  ]

  const masonryImages = [
    { image: '/images/suit-hero 2.jpg', category: 'Men', link: '/shop?category=men' },
    { image: '/images/lady1.png', category: 'Women', link: '/shop?category=women' },
    { image: '/images/shoe 2.png', category: 'Featured', link: '/shop?category=featured' },
        { image: '/images/kids.png', category: 'Kids', link: '/shop?category=kids' },
  ]

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length)
    }, 7500)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Gold shimmer effect on CTA
  useEffect(() => {
    if (!ctaRef.current) return
    
    const timer = setTimeout(() => {
      ctaRef.current?.classList.add('animate-shimmer')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-screen overflow-hidden hero-section"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-4 md:gap-0">
        {/* Large Hero Image - Left/Top */}
        <div className="relative h-full overflow-hidden group">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentHero].image}
              alt={heroImages[currentHero].title}
              fill
              className="hero-image object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/40 to-transparent" />
          </motion.div>

          {/* Hero Content */}
          <motion.div
            key={`content-${currentHero}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-20 left-8 md:left-20 right-8 md:right-auto max-w-lg z-10"
          >
            <h1 className="font-sora font-bold text-5xl md:text-6xl text-white mb-4 tracking-tight leading-tight">
              {heroImages[currentHero].title}
            </h1>
            <p className="font-sora font-light text-lg text-white/90 mb-8 max-w-md leading-relaxed">
              {heroImages[currentHero].subtitle}
            </p>
            <Button
              ref={ctaRef}
              asChild
              className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold text-base px-8 py-6 rounded-none transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,184,0,0.4)] relative overflow-hidden"
            >
              <Link href="/shop">
                {heroImages[currentHero].cta}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Hero Indicators */}
          <div className="absolute bottom-8 left-8 md:left-20 flex gap-2 z-10">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-10 h-1 transition-all duration-300 ${
                  idx === currentHero ? 'bg-gold-primary' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Masonry Grid - Right/Bottom */}
        <div className="grid grid-cols-2 gap-4 p-4 md:p-0 h-[50vh] md:h-full">
          {masonryImages.map((item, idx) => (
            <MasonryCard
              key={item.category}
              image={item.image}
              category={item.category}
              link={item.link}
              delay={idx * 0.1}
              tall={idx % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Masonry Card Component
function MasonryCard({
  image,
  category,
  link,
  delay,
  tall,
}: {
  image: string
  category: string
  link: string
  delay: number
  tall: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`relative overflow-hidden cursor-pointer group ${
        tall ? 'row-span-2' : 'row-span-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={link} className="block h-full">
        <div className="relative h-full min-h-[200px]">
          <Image
            src={image}
            alt={category}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
          />
          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-charcoal/30 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Category Label */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <h3 className="font-sora font-semibold text-2xl text-white">
              {category}
            </h3>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}

// Shop by Category Section
function ShopByCategory() {
  const categories = [
    { name: 'Men', image: '/images/suit-hero.png', link: '/shop?category=men' },
    { name: 'Women', image: '/images/lady1.png', link: '/shop?category=women' },
    { name: 'Kids', image: '/images/kids.png', link: '/shop?category=kids' },
    { name: 'Featured', image: '/images/hat1.png', link: '/shop?category=featured' },
  ]

  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-24 px-8 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-sora font-bold text-4xl md:text-5xl text-charcoal mb-16 text-center tracking-tight"
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <CategoryCard
              key={category.name}
              category={category}
              delay={idx * 0.08}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Category Card Component
function CategoryCard({
  category,
  delay,
  isInView,
}: {
  category: { name: string; image: string; link: string }
  delay: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <Link href={category.link}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-600 group-hover:scale-108"
          />
          {/* Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
          
          {/* Category Name */}
          <div className="absolute bottom-8 left-6 right-6 z-10">
            <h3 className="font-sora font-bold text-3xl text-white mb-2">
              {category.name}
            </h3>
            <motion.div
              initial={{ width: 0 }}
              animate={isHovered ? { width: '60px' } : { width: 0 }}
              transition={{ duration: 0.3 }}
              className="h-0.5 bg-gold-primary"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Curated Collections Section
function CuratedCollections() {
  const collections = [
    {
      name: 'Premium Shirts',
      description: 'Tailored perfection',
      image: '/images/shirt 1.png',
      link: '/shop?collection=shirts',
      size: 'large',
    },
    {
      name: 'Signature Footwear',
      description: 'Step with confidence',
      image: '/images/shoe 1.png',
      link: '/shop?collection=shoes',
      size: 'medium',
    },
    {
      name: 'Designer Denim',
      description: 'Casual elegance',
      image: '/images/jean 1.png',
      link: '/shop?collection=jeans',
      size: 'medium',
    },
    {
      name: 'Accessories',
      description: 'The finishing touch',
      image: '/images/hat1.png',
      link: '/shop?collection=accessories',
      size: 'small',
    },
  ]

  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-24 px-8 md:px-16 bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-sora font-bold text-4xl md:text-5xl text-charcoal mb-16 text-center tracking-tight"
        >
          Curated Collections
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {collections.map((collection, idx) => (
            <CollectionCard
              key={collection.name}
              collection={collection}
              delay={idx * 0.1}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Collection Card Component
function CollectionCard({
  collection,
  delay,
  isInView,
}: {
  collection: {
    name: string
    description: string
    image: string
    link: string
    size: string
  }
  delay: number
  isInView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current || !isInView) return

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        rotation: 2,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=100',
        },
      })
    }, cardRef)

    return () => ctx.revert()
  }, [isInView, delay])

  const colSpan =
    collection.size === 'large'
      ? 'md:col-span-6'
      : collection.size === 'medium'
      ? 'md:col-span-6'
      : 'md:col-span-4'

  return (
    <motion.div
      ref={cardRef}
      className={`${colSpan} group cursor-pointer`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={collection.link}>
        <div className="bg-white rounded-none overflow-hidden transition-shadow duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <h3 className="font-sora font-semibold text-2xl text-charcoal mb-2">
              {collection.name}
            </h3>
            <p className="font-sora font-light text-sm text-gray-600 mb-4">
              {collection.description}
            </p>
            <span className="inline-flex items-center font-sora font-semibold text-sm text-gold-primary group-hover:text-gold-dark transition-colors">
              Shop Now
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="ml-1 h-4 w-4" />
              </motion.span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Brand Story Section
function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true })

  return (
    <section ref={sectionRef} className="py-32 px-8 bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="w-16 h-0.5 bg-gold-primary mx-auto mb-8" />
        <h2 className="font-sora font-semibold text-4xl text-charcoal mb-6 tracking-tight">
          Crafted for the Modern You
        </h2>
        <p className="font-sora font-light text-lg text-gray-900 leading-relaxed">
          We believe style is personal. Our collections blend global trends with local confidence, 
          designed for those who live boldly and dress intentionally.
        </p>
      </motion.div>
    </section>
  )
}

// Video Section
function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true })

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play()
    }
  }, [isInView])

  return (
    <section ref={sectionRef} className="relative h-[70vh] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        poster="/images/video-poster.jpg"
      >
        <source src="/videos/lifestyle.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-charcoal/20" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8"
      >
        <h2 className="font-sora font-bold text-5xl md:text-6xl text-white mb-8 tracking-tight">
          Experience the Difference
        </h2>
        <Button
          asChild
          className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold text-base px-8 py-6 rounded-none transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,184,0,0.4)]"
        >
          <Link href="/shop">
            View Collection
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}



