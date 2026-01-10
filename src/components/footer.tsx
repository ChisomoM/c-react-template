'use client'

// import { Button } from './ui/button';
// import { Input } from './ui/input';
import { Separator } from './ui/separator';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Link
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="font-sora font-extrabold text-2xl text-gold-bright mb-4">
              Premium Fashion
            </h3>
            <p className="font-sora font-light text-sm text-gray-300">
              Zambia's modern luxury fashion destination
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-white mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              {['Men', 'Women', 'Kids', 'Featured'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/shop?category=${item.toLowerCase()}`}
                    className="font-sora font-light text-sm text-gray-300 hover:text-gold-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              {['Shipping', 'Returns', 'Size Guide', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="font-sora font-light text-sm text-gray-300 hover:text-gold-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-white mb-4 uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="font-sora font-light text-sm text-gray-300 mb-4">
              Get exclusive offers and updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-2 text-sm font-sora font-light focus:outline-none focus:border-gold-primary transition-colors"
              />
              <Button className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none px-6">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-600">
          <p className="font-sora font-light text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} Premium Fashion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}