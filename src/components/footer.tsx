'use client'

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="font-sora font-extrabold text-2xl mb-2">
              {/* <span className="text-white">Premium</span> */}
              <span className="text-gold-primary ml-1">Luxury</span>
            </h3>
            <p className="font-sora font-light text-sm text-gray-300 mb-6">
              Elevate your style with curated luxury fashion collections.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-primary mt-0.5 flex-shrink-0" />
                <p className="font-sora text-xs text-gray-300">
                  Lusaka, Zambia
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold-primary flex-shrink-0" />
                <p className="font-sora text-xs text-gray-300">
                  +260 XXX XXX XXX
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold-primary flex-shrink-0" />
                <p className="font-sora text-xs text-gray-300">
                  hello@luxury.com
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-white mb-6 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'All Products', href: '/shop' },
                { name: 'New Arrivals', href: '/shop?filter=new' },
                { name: 'Best Sellers', href: '/shop?filter=bestsellers' },
                { name: 'Sale', href: '/shop?filter=sale' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-sora font-light text-sm text-gray-300 hover:text-gold-primary transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-white mb-6 uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', href: '/#contact' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns', href: '/returns' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'FAQ', href: '/faq' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-sora font-light text-sm text-gray-300 hover:text-gold-primary transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-white mb-6 uppercase tracking-wider">
              Stay Connected
            </h4>
            <p className="font-sora font-light text-sm text-gray-300 mb-4">
              Subscribe for exclusive offers and style updates.
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border border-gray-600 text-white placeholder:text-gray-500 px-4 py-2.5 text-sm font-sora font-light focus:outline-none focus:border-gold-primary transition-colors rounded-none"
              />
              <Button className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none px-6 transition-all duration-300">
                Join
              </Button>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sora font-light text-xs text-gray-400">
              © {new Date().getFullYear()} Luxury. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                href="/privacy" 
                className="font-sora font-light text-xs text-gray-400 hover:text-gold-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="font-sora font-light text-xs text-gray-400 hover:text-gold-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}