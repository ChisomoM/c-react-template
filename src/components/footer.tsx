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
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Platform': [
      { label: 'API Documentation', href: '#docs' },
    //   { label: 'SDKs & Libraries', href: '#sdks' },
      { label: 'Integration Guide', href: '#guide' },
    //   { label: 'Rate Limits', href: '#limits' },
    //   { label: 'Status Page', href: '#status' }
    ],
    'Services': [
      { label: 'Airtime Top-up', href: '#airtime' },
      { label: 'Data Bundles', href: '#data' },
      { label: 'Bill Payments', href: '#bills' },
      { label: 'e-toll Payment', href: '#transfer' },
    //   { label: 'Bulk Operations', href: '#bulk' }
    ],
    'Company': [
      { label: 'Probase', href: 'https://pbsdemo.probasegroup.com' },
    //   { label: 'Our Team', href: '#team' },
    //   { label: 'Careers', href: '#careers' },
    //   { label: 'Press Kit', href: '#press' },
    //   { label: 'Contact', href: '#contact' }
    ],
    // 'Resources': [
    //   { label: 'Blog', href: '#blog' },
    //   { label: 'Case Studies', href: '#cases' },
    //   { label: 'Help Center', href: '#help' },
    //   { label: 'Community', href: '#community' },
    //   { label: 'Webinars', href: '#webinars' }
    // ],
    'Legal': [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
    //   { label: 'Compliance', href: '#compliance' },
    //   { label: 'Security', href: '#security' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-orange-100">
                Get the latest updates on new features, partnerships, and industry insights.
              </p>
            </div>
            <div className="flex space-x-4">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-white text-gray-900 border-0 flex-1"
              />
              <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50 px-6">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Smart<span className="text-orange-500">Hub</span>
              </h2>
              <p className="text-gray-400 mt-2">
                Empowering businesses and individuals across Africa with seamless payment 
                infrastructure and reliable financial services.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">info@probasegroup.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">+260 976 360 360</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">Plot 2374 Kelvin Siwale Rd, Lusaka, Zambia</span>
              </div>
            </div>

            {/* Social Links
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div> */}
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-gray-400 text-sm">
            © {currentYear} Probase Group. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-400">All systems operational</span>
            </div>
           
          </div>
        </div>
      </motion.div>
    </footer>
  );
}