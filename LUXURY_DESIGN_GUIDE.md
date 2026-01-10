# Premium Luxury E-Commerce Design System Guide
## Creating Consistent Pages Across the Application

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout Patterns](#layout-patterns)
5. [Component Patterns](#component-patterns)
6. [Animation Guidelines](#animation-guidelines)
7. [Page Structure Template](#page-structure-template)
8. [Code Examples](#code-examples)

---

## Design Philosophy

### Core Principles
- **Quiet Luxury**: Expensive feel without ostentation
- **Generous Spacing**: Never feel crampeduse padding liberally
- **Surgical Gold Usage**: Gold appears only on CTAs, accents, hover states (10% rule)
- **Editorial Feel**: Magazine-quality imagery with clean layouts
- **Cinematic Motion**: Smooth, noticeable animations that feel premium

### Target Aesthetic
- 80% Modern/Avant-Garde, 20% Timeless/Classic
- Accessible aspiration (not intimidating)
- Zambian context with global inspiration

---

## Color System

### Primary Palette
`	ypescript
// Gold Accents (Use sparingly - 10% of screen max)
gold: {
  primary: '#E6B800',    // CTAs, active states, primary buttons
  bright: '#FFD60A',     // Logo on dark backgrounds, bright accents
  dark: '#CC9900',       // Hover states, prices, secondary accents
  light: '#FFEB99',      // Subtle backgrounds, gentle highlights
}

// Neutrals (60-70% of design)
charcoal: '#1A1A1A',     // Primary text, dark backgrounds
gray: {
  900: '#2D2D2D',        // Body text, dark elements
  600: '#757575',        // Secondary text, muted content
  300: '#E0E0E0',        // Borders, dividers, subtle lines
}
cream: '#FAF7F2',        // Alternate backgrounds, soft sections
white: '#FFFFFF',        // Primary background, cards
`

### Usage Rules
- **Never**: Gold on gold, gold on yellow backgrounds
- **Always**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Background hierarchy**: White  Cream  White (alternating sections)
- **Text hierarchy**: Charcoal (headings)  Gray-900 (body)  Gray-600 (captions)

---

## Typography

### Font Family
`	ypescript
// Google Fonts import in layout.tsx
import { Sora } from 'next/font/google'

const sora = Sora({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-sora',
})
`

### Type Scale
`	ypescript
// Tailwind classes to use
Headings (Hero): 'font-sora font-bold text-5xl md:text-6xl tracking-tight leading-tight'
Headings (Section): 'font-sora font-bold text-4xl md:text-5xl tracking-tight'
Subheadings: 'font-sora font-semibold text-2xl md:text-3xl'
Body: 'font-sora font-light text-base md:text-lg leading-relaxed'
Captions: 'font-sora font-light text-sm text-gray-600'
Buttons: 'font-sora font-semibold text-sm md:text-base'
`

### Typography Guidelines
- **Letter spacing**: Headings use \	racking-tight\ (-0.02em)
- **Line height**: Body text needs \leading-relaxed\ (1.625)
- **Font weights**: 300 (light), 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)
- **Never**: Use default system fonts, use Arial/Helvetica
- **Always**: Apply font-sora class to all text elements

---

## Layout Patterns

### Page Structure
Every page should follow this structure:

`	sx
<div className="min-h-screen bg-white">
  {/* Fixed navbar already handles top spacing */}
  <div className="pt-32 pb-20"> {/* Top padding for fixed navbar */}
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      {/* Page content */}
    </div>
  </div>
</div>
`

### Section Spacing
`	ypescript
// Vertical spacing between sections
py-24 md:py-32  // Large sections (hero, major content blocks)
py-16 md:py-20  // Medium sections (features, grids)
py-12 md:py-16  // Small sections (compact content)

// Horizontal padding
px-6 lg:px-12   // Page-level horizontal padding
px-8 md:px-16   // Section-level horizontal padding
`

### Grid Patterns
`	ypescript
// Product/Card Grids
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6

// Two-Column Layouts
grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12

// Feature Grids
grid grid-cols-1 md:grid-cols-3 gap-8
`

---

## Component Patterns

### Hero Section Pattern
`	sx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mb-12"
>
  <h1 className="font-sora font-bold text-5xl md:text-6xl text-charcoal mb-4 tracking-tight">
    Page Title
  </h1>
  <p className="font-sora font-light text-lg text-gray-600">
    Compelling subtitle or description
  </p>
</motion.div>
`

### Image Card Pattern
`	sx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6, delay }}
  className="group cursor-pointer"
>
  <Link href={link}>
    <div className="relative aspect-[4/5] overflow-hidden bg-cream">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Gradient overlay if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
    </div>
    <div className="mt-4">
      <h3 className="font-sora font-semibold text-lg text-charcoal group-hover:text-gold-dark transition-colors">
        {title}
      </h3>
      <p className="font-sora font-light text-sm text-gray-600 mt-2">
        {description}
      </p>
    </div>
  </Link>
</motion.div>
`

### Button Pattern
`	sx
// Primary CTA (Gold)
<Button
  className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold text-base px-8 py-6 rounded-none transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,184,0,0.4)]"
>
  Button Text
</Button>

// Secondary CTA (Charcoal)
<Button
  className="bg-charcoal hover:bg-gold-primary text-white hover:text-charcoal font-sora font-semibold text-base px-8 py-6 rounded-none transition-all duration-300"
>
  Button Text
</Button>

// Outline Button
<Button
  variant="outline"
  className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-sora font-semibold rounded-none"
>
  Button Text
</Button>
`

### Filter/Sort Bar Pattern
`	sx
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-300">
  {/* Filters */}
  <div className="flex items-center gap-2">
    {options.map((option) => (
      <button
        key={option.id}
        onClick={() => setSelected(option.id)}
        className={\
          px-4 py-2 font-sora font-medium text-sm
          transition-all duration-300 rounded-none
          \
        \}
      >
        {option.name}
      </button>
    ))}
  </div>
  
  {/* Count or additional info */}
  <div className="font-sora font-light text-sm text-gray-600">
    {count} items
  </div>
</div>
`

---

## Animation Guidelines

### Required Imports
`	sx
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useEffect } from 'react'
`

### Fade-In on Scroll Pattern
`	sx
const sectionRef = useRef<HTMLDivElement>(null)
const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

return (
  <section ref={sectionRef}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Content */}
    </motion.div>
  </section>
)
`

### Staggered Grid Animation
`	sx
{items.map((item, idx) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: idx * 0.08 }}
  >
    {/* Card content */}
  </motion.div>
))}
`

### Hover Animation Pattern
`	sx
<motion.div
  whileHover={{ y: -8 }}
  transition={{ duration: 0.3 }}
  className="group"
>
  {/* Content with group-hover: classes */}
</motion.div>
`

### GSAP Parallax Pattern
`	sx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.parallax-element', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  })
  
  return () => ctx.revert()
}, [])
`

### Animation Timing Standards
- **Page load**: 0.6s duration
- **Hover effects**: 0.3s duration
- **Stagger delay**: 0.08-0.1s between items
- **Image scale**: duration-500 (500ms)
- **Always**: Use \ease-out\ or default easing

---

## Page Structure Template

### Complete Page Template
`	sx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Icon1, Icon2 } from 'lucide-react'

export default function YourPage() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const searchParams = useSearchParams()

  useEffect(() => {
    // Load data
    loadData()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
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
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-sora font-bold text-5xl md:text-6xl text-charcoal mb-4 tracking-tight">
            Page Title
          </h1>
          <p className="font-sora font-light text-lg text-gray-600">
            Engaging description that draws users in
          </p>
        </motion.div>

        {/* Main Content */}
        <section ref={sectionRef}>
          {/* Your content here */}
        </section>
      </div>
    </div>
  )
}
`

---

## Code Examples

### Product/Item Grid
`	sx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map((item, idx) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.08 }}
      className="group"
    >
      <Link href={\/path/\\}>
        <div className="relative aspect-[4/5] overflow-hidden bg-cream mb-4">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <h3 className="font-sora font-semibold text-lg text-charcoal group-hover:text-gold-dark transition-colors">
          {item.title}
        </h3>
        <p className="font-sora font-light text-sm text-gray-600 mt-2">
          {item.description}
        </p>
      </Link>
    </motion.div>
  ))}
</div>
`

### Empty State Pattern
`	sx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="text-center py-20"
>
  <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
  <h3 className="font-sora font-semibold text-2xl text-charcoal mb-2">
    No items found
  </h3>
  <p className="font-sora font-light text-gray-600 mb-8">
    Try adjusting your filters or check back later
  </p>
  <Button
    onClick={resetAction}
    className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none"
  >
    Reset Filters
  </Button>
</motion.div>
`

### Section with Background Toggle
`	sx
// Alternate between white and cream backgrounds
<section className="py-24 px-8 md:px-16 bg-white">
  {/* Content */}
</section>

<section className="py-24 px-8 md:px-16 bg-cream">
  {/* Content */}
</section>

<section className="py-24 px-8 md:px-16 bg-white">
  {/* Content */}
</section>
`

---

## Image Guidelines

### Available Images
Current images in \/public/images/\:
- \suit-hero.jpg\, \suit-hero 2.jpg\
- \shoe 1.png\, \shoe 2.png\, \shoe 3.png\, \shoes-hero.jpg\
- \shirt 1.png\, \shirt 2.png\, \shirt 3.png\
- \jean 1.png\, \jean 2.png\, \jean 3.png\
- \hat1.png\, \hat2.png\, \hat3.png\
- \lady1.png\, \kids.png\

### Image Usage Pattern
`	sx
import Image from 'next/image'

<Image
  src="/images/your-image.jpg"
  alt="Descriptive alt text"
  fill
  className="object-cover"
  priority={isAboveFold} // Only for hero images
/>
`

### Aspect Ratios
- **Product cards**: \spect-[4/5]\ (portrait)
- **Hero images**: \spect-video\ or full viewport
- **Feature images**: \spect-square\ or \spect-[3/4]\

---

## Checklist for New Pages

### Before Starting
- [ ] Review this guide thoroughly
- [ ] Check existing pages (Home, Shop) for patterns
- [ ] Identify required images and verify they exist
- [ ] Plan section hierarchy (Hero  Content  CTA)

### During Development
- [ ] Use \ont-sora\ on ALL text elements
- [ ] Apply gold accents sparingly (10%)
- [ ] Add \pt-32\ to account for fixed navbar
- [ ] Use Framer Motion for scroll animations
- [ ] Include \isInView\ for performance
- [ ] Add stagger delays to grids
- [ ] Use proper aspect ratios
- [ ] Apply hover effects to interactive elements

### Before Committing
- [ ] Test mobile responsiveness (320px, 768px, 1024px, 1440px)
- [ ] Verify all animations are smooth
- [ ] Check accessibility (aria-labels, contrast ratios)
- [ ] Test loading states
- [ ] Verify empty states
- [ ] Run \pnpm lint\ and fix errors
- [ ] Test with keyboard navigation
- [ ] Verify gold accent usage (10% rule)

---

## Common Mistakes to Avoid

###  DON'T
- Use default fonts (Arial, Helvetica, system)
- Apply gold backgrounds or excessive gold
- Use hard corners on luxury elements (use \ounded-none\ deliberately)
- Skip loading states
- Forget \pt-32\ top padding
- Use inline styles (prefer Tailwind classes)
- Mix font families
- Use bright, saturated colors besides gold
- Skip empty states
- Ignore mobile breakpoints

###  DO
- Always use \ont-sora\
- Gold only on: buttons, hover states, active states, small accents
- Add generous padding/spacing
- Include smooth transitions (duration-300, duration-500)
- Test on multiple screen sizes
- Use \Image\ from next/image
- Apply \	racking-tight\ to headlines
- Use \leading-relaxed\ for body text
- Include accessibility attributes
- Test animations on slow devices

---

## Quick Reference: Common Patterns

### Gold Button
\\\
bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none
\\\

### Charcoal Button
\\\
bg-charcoal hover:bg-gold-primary text-white hover:text-charcoal font-sora font-semibold rounded-none
\\\

### Section Header
\\\
font-sora font-bold text-4xl md:text-5xl text-charcoal mb-16 text-center tracking-tight
\\\

### Card Grid
\\\
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
\\\

### Image Card
\\\
relative aspect-[4/5] overflow-hidden bg-cream
\\\

### Fade-in Animation
\\\	sx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
\\\

---

## Resources

### Design References
- Homepage: \src/app/(public)/HomeClient.tsx\
- Shop: \src/app/(public)/shop/page.tsx\
- Navbar: \src/components/navbar.tsx\

### Dependencies
- Framer Motion: Animations
- GSAP: Advanced animations (parallax, complex sequences)
- Lucide React: Icons
- Next.js Image: Optimized images
- Tailwind CSS: Utility-first styling

### Tailwind Config
Colors and fonts are defined in \	ailwind.config.mjs\

---

**Remember**: Consistency is luxury. Every page should feel like part of a cohesive, high-end experience.
