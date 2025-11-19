// import { useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { Badge } from '@/components/ui/badge';
// import { CreditCard, Phone, Wallet, Code2, CheckCircle2 } from 'lucide-react';

// export function ScrollytellingFeatures() {
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   // Track scroll progress of the entire container
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"]
//   });

//   // Create scroll-based opacity transforms for each section
//   // Section 1: visible from 0 to 0.33
//   const section1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.4], [1, 1, 0, 0]);

//   // Section 2: visible from 0.33 to 0.66
//   const section2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);

//   // Section 3: visible from 0.66 to 1
//   const section3Opacity = useTransform(scrollYProgress, [0.6, 0.7, 1], [0, 1, 1]);

//   return (
//     <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
//       {/* Animated Background Elements - matching hero style */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div 
//           animate={{y: [0, -20, 0], rotate: [0, 5, 0]}}
//           transition={{duration: 8, repeat: Infinity, ease: "easeInOut"}}
//           className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-xl">
//         </motion.div>
//         <motion.div 
//           animate={{x: [0, 20, 0], y: [0, -15, 0]}}
//           transition={{duration: 10, repeat: Infinity, ease: "easeInOut"}}
//           className="absolute top-40 right-20 w-40 h-40 bg-blue-200 rounded-full opacity-15 blur-xl">
//         </motion.div>
//         <motion.div 
//           animate={{scale: [1, 1.2, 1]}}
//           transition={{duration: 6, repeat: Infinity, ease: "easeInOut"}}
//           className="absolute bottom-32 left-1/4 w-24 h-24 bg-orange-300 rounded-full opacity-10 blur-xl">
//         </motion.div>
//       </div>

//       <div ref={containerRef} className="relative">
//         {/* Container for scrolling sections */}
//         <div className="max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8">
          
//           {/* Grid Layout - Left scrolls, Right sticky */}
//           <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
//             {/* LEFT SIDE - Scrolling Text Content */}
//             <div className="space-y-32 py-20">
              
//               {/* Section 1: Accept Payments through Multiple Channels */}
//               <motion.div 
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 viewport={{ once: true }}
//                 className="min-h-[80vh] flex flex-col justify-center space-y-6"
//               >
//                 <Badge className="bg-orange-100 text-orange-700 w-fit">Payment Channels</Badge>
                
//                 <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//                   Accept Payments through 
//                   <span className="text-orange-500 block mt-2">Multiple Channels</span>
//                 </h2>
                
//                 <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
//                   Cards, Mobile Money, and Bank Transfers.
//                 </p>

//                 <div className="space-y-4 pt-4">
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                       <CreditCard className="w-5 h-5 text-orange-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Card Payments</h3>
//                       <p className="text-sm text-gray-600">Accept Visa, Mastercard, and other major card networks</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <Phone className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Mobile Money</h3>
//                       <p className="text-sm text-gray-600">MTN, Airtel, Zamtel and all major mobile money providers</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                       <Wallet className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Bank Transfers</h3>
//                       <p className="text-sm text-gray-600">Direct bank transfers from all major financial institutions</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Mobile Image for Section 1 */}
//                 <div className="lg:hidden mt-8">
//                   <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '75%' }}>
//                     <img 
//                       src="/temp-img.jpg" 
//                       alt="Multiple Payment Channels" 
//                       className="absolute inset-0 w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Section 2: Hosted Checkout */}
//               <motion.div 
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 viewport={{ once: true }}
//                 className="min-h-[80vh] flex flex-col justify-center space-y-6"
//               >
//                 <Badge className="bg-blue-100 text-blue-700 w-fit">Easy Integration</Badge>
                
//                 <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//                   <span className="text-orange-500">Hosted Checkout</span>
//                 </h2>
                
//                 <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
//                   A ready-to-use, customizable checkout page that simplifies payment collection with customizable branding.
//                 </p>

//                 <div className="space-y-4 pt-4">
//                   <div className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Ready to Use</h3>
//                       <p className="text-sm text-gray-600">Pre-built checkout page that works out of the box</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Customizable Branding</h3>
//                       <p className="text-sm text-gray-600">Match your brand with custom colors, logos, and styling</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Secure & Compliant</h3>
//                       <p className="text-sm text-gray-600">PCI-DSS compliant with enterprise-grade security</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Mobile Optimized</h3>
//                       <p className="text-sm text-gray-600">Perfect experience across all devices and screen sizes</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Mobile Image for Section 2 */}
//                 <div className="lg:hidden mt-8">
//                   <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '75%' }}>
//                     <img 
//                       src="/temp-img.jpg" 
//                       alt="Hosted Checkout" 
//                       className="absolute inset-0 w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Section 3: APIs Built for Developers */}
//               <motion.div 
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 viewport={{ once: true }}
//                 className="min-h-[80vh] flex flex-col justify-center space-y-6"
//               >
//                 <Badge className="bg-purple-100 text-purple-700 w-fit">For Developers</Badge>
                
//                 <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//                   APIs Built for
//                   <span className="text-orange-500 block mt-2">Developers</span>
//                 </h2>
                
//                 <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
//                   Integrate seamless and secure payments with our well-documented APIs. Built for developers, 
//                   trusted by businesses of all sizes.
//                 </p>

//                 <div className="space-y-4 pt-4">
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                       <Code2 className="w-5 h-5 text-orange-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">RESTful APIs</h3>
//                       <p className="text-sm text-gray-600">Clean, intuitive API design with comprehensive documentation</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Multiple SDKs</h3>
//                       <p className="text-sm text-gray-600">Node.js, Python, PHP, Java, C#, Go and more</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Sandbox Environment</h3>
//                       <p className="text-sm text-gray-600">Test thoroughly before going live with our sandbox</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-3">
//                     <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Webhooks & Real-time Updates</h3>
//                       <p className="text-sm text-gray-600">Get instant notifications for all transaction events</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Mobile Code Example for Section 3 */}
//                 <div className="lg:hidden mt-8">
//                   <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl">
//                     <div className="flex items-center space-x-2 mb-4">
//                       <div className="w-3 h-3 bg-red-400 rounded-full"></div>
//                       <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
//                       <div className="w-3 h-3 bg-green-400 rounded-full"></div>
//                       <span className="ml-4 text-gray-400 text-xs">Probase Payment Gateway API</span>
//                     </div>
//                     <pre className="text-green-400 text-xs overflow-x-auto">
// {`// Initialize Payment Gateway
// const payment = new PaymentGateway({
//   apiKey: 'your-api-key',
//   environment: 'production'
// });

// // Process Payment
// const response = await payment.process({
//   reference: 'INV-1001',
//   amount: 1000,
//   currency: 'USD',
//   method: 'card'
// });

// console.log(response.transactionId);
// // Returns: "txn_abc123xyz"
// `}
//                     </pre>
//                   </div>
                  
//                   <div className="mt-4 bg-white rounded-lg shadow-lg p-3 border border-orange-100 w-fit">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                       <span className="text-xs font-medium text-gray-700">Live Documentation</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//             </div>

//             {/* RIGHT SIDE - Sticky Visual Content */}
//             <div className="relative hidden lg:block">
//               <div className="sticky top-32 h-[80vh] flex items-center justify-center">
//                 {/* Sticky container with aspect ratio 4:3 */}
//                 <div className="relative w-full mx-auto" style={{ maxWidth: '640px' }}>
//                   <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
                    
//                     {/* Section 1 Image - Multiple Payment Channels */}
//                     <motion.div
//                       style={{ 
//                         opacity: section1Opacity,
//                       }}
//                       transition={{ duration: 0.6 }}
//                       className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
//                     >
//                       <img 
//                         src="/temp-img.jpg" 
//                         alt="Multiple Payment Channels" 
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                     </motion.div>

//                     {/* Section 2 Image - Hosted Checkout */}
//                     <motion.div
//                       style={{ 
//                         opacity: section2Opacity,
//                       }}
//                       transition={{ duration: 0.6 }}
//                       className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
//                     >
//                       <img 
//                         src="/temp-img.jpg" 
//                         alt="Hosted Checkout" 
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                     </motion.div>

//                     {/* Section 3 - Code Example */}
//                     <motion.div
//                       style={{ 
//                         opacity: section3Opacity,
//                       }}
//                       transition={{ duration: 0.6 }}
//                       className="absolute inset-0 flex items-center p-4"
//                     >
//                       <div className="w-full">
//                         <div className="bg-gray-900 rounded-2xl p-4 lg:p-6 shadow-2xl">
//                           <div className="flex items-center space-x-2 mb-4">
//                             <div className="w-3 h-3 bg-red-400 rounded-full"></div>
//                             <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
//                             <div className="w-3 h-3 bg-green-400 rounded-full"></div>
//                             <span className="ml-4 text-gray-400 text-xs sm:text-sm">Probase Payment Gateway API</span>
//                           </div>
//                           <pre className="text-green-400 text-xs sm:text-sm overflow-x-auto scrollbar-hide">
// {`// Initialize Payment Gateway
// const payment = new PaymentGateway({
//   apiKey: 'your-api-key',
//   environment: 'production'
// });

// // Process Payment
// const response = await payment.process({
//   reference: 'INV-1001',
//   amount: 1000,
//   currency: 'USD',
//   method: 'card'
// });

// console.log(response.transactionId);
// // Returns: "txn_abc123xyz"
// `}
//                           </pre>
//                         </div>
                        
//                         <div className="mt-4 bg-white rounded-lg shadow-lg p-3 border border-orange-100 w-fit">
//                           <div className="flex items-center space-x-2">
//                             <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                             <span className="text-xs font-medium text-gray-700">Live Documentation</span>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>

//                   </div>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
