'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Package, TrendingUp, Shield } from 'lucide-react'

export default function HomeClient() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Fashion for the Modern Zambian
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Discover our curated collection of premium suits, shoes, and accessories. 
              Quality craftsmanship meets affordable prices.
            </p>
            <div className="flex gap-4">
              <Link href="/shop">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Browse Combos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                From formal suits to casual wear, find everything you need in one place
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing in ZMW with exclusive bundle discounts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Premium materials and craftsmanship in every product
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Upgrade Your Wardrobe?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Check out our exclusive Gentleman's Starter Pack and save 15%
            </p>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
