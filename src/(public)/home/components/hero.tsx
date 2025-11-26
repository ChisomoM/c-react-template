import { ArrowRight, Zap, Phone, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';


export default function Hero(){
    return(
        <div>      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden min-h-[90vh] flex items-center">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <motion.div 
      animate={{y: [0, -20, 0], rotate: [0, 5, 0]}}
      transition={{duration: 8, repeat: Infinity, ease: "easeInOut"}}
      className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-xl">
    </motion.div>
    <motion.div 
      animate={{x: [0, 20, 0], y: [0, -15, 0]}}
      transition={{duration: 10, repeat: Infinity, ease: "easeInOut"}}
      className="absolute top-40 right-20 w-40 h-40 bg-blue-200 rounded-full opacity-15 blur-xl">
    </motion.div>
    <motion.div 
      animate={{scale: [1, 1.2, 1]}}
      transition={{duration: 6, repeat: Infinity, ease: "easeInOut"}}
      className="absolute bottom-32 left-1/4 w-24 h-24 bg-orange-300 rounded-full opacity-10 blur-xl">
    </motion.div>
  </div>

  <div className="relative max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
    {/* Main Grid Layout - Left (Content) & Right (Interactive Panel) */}
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      
      {/* LEFT SIDE - Messaging & Value Proposition */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="text-left space-y-6">
        
        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">Secure and reliable payment gateway</span>
        </motion.div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-blue leading-tight">
          Simplifying the Way
          <span className="text-orange-500 block mt-2">Businesses Transact</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
       Reach customers around the world with our secure payment gateway. Accept online payments in ZMW, 
       USD, or any currency via mobile money, bank transfers, and cards—all in one seamless system.        </p>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Instant Processing</h3>
              <p className="text-sm text-gray-600">Payments processed in seconds</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">100% Secure</h3>
              <p className="text-sm text-gray-600">Bank-grade encryption</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">24/7 Available</h3>
              <p className="text-sm text-gray-600">Pay anytime, anywhere</p>
            </div>
          </div>

          {/* <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">All Networks</h3>
              <p className="text-sm text-gray-600">MTN, Airtel, Zamtel & more</p>
            </div>
          </div> */}
        </div>

        {/* CTA for Business Users (Secondary audience) */}
        <div className="pt-6">
          <p className="text-sm text-gray-600 mb-3">Building a business solution?</p>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Explore Our API
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.div>

   
    </div>
  </div>
</section></div>
    )
}