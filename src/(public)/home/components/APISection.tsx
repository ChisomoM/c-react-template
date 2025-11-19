import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, BarChart3, Shield, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';


export function APISection() {
  const features = [
    {
      icon: Code2,
      title: "Easy API Integration",
      description: "RESTful APIs with comprehensive documentation. Get started in minutes with our SDKs for popular programming languages.",
      badge: "Developer Friendly"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor transactions from initiation to completion. Get detailed insights into your payment flows and customer behavior.",
      badge: "Business Intelligence"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption. Comply with industry standards and protect your customers' data.",
      badge: "Secure"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second transaction processing with 99.9% uptime guarantee. Scale your business without worrying about performance.",
      badge: "High Performance"
    },
  ];

  return (
    <section id="apis" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-orange-100 text-orange-700 mb-4">For Businesses</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            APIs Built for 
            <span className="text-orange-500"> Developers</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Integrate seamless and secure payments with our well-documented APIs. 
            Built for developers, trusted by businesses of all sizes to power fast, reliable, and scalable transactions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                <Card className="border border-gray-100 hover:border-orange-200 transition-colors group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Code Example */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gray-900 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="ml-4 text-gray-400 text-sm">Probase Payment gateway API Integration</span>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
{`// Initialize Payment Gateway
const payment = new PaymentGateway({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Make Payment
const response = await payment.process({
  reference: 'INV-1001',
  amount: 1000,
  currency: 'USD',
  method: 'card'
});

console.log(response.transactionId);
// Returns: "txn_abc123xyz"
`}
              </pre>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-orange-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">Live Documentation</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Integration Partners */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Seamless Integration with Your Stack
              </h3>
              <p className="text-gray-600 mb-6">
                Our APIs work with any technology stack. Get started with our pre-built SDKs 
                or use our REST APIs directly.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-white text-gray-700">Node.js</Badge>
                <Badge className="bg-white text-gray-700">Python</Badge>
                <Badge className="bg-white text-gray-700">PHP</Badge>
                <Badge className="bg-white text-gray-700">Java</Badge>
                <Badge className="bg-white text-gray-700">C#</Badge>
                <Badge className="bg-white text-gray-700">Go</Badge>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                View Documentation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div>
              <img className='w-full h-64 object-cover rounded-xl'
              src={"/laptop.jpeg"} 
              alt={'laptop'}
              >
              
              </img>
                {/* <Image
                height={0}
                width={0}
                src={"/laptop.jpeg"} 
                alt={'laptop'}
                className='w-full h-64 object-cover rounded-xl'
                priority
                unoptimized
                ></Image> */}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function APIDocs(){
  return(
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl justify-center items center py-12 max-w-7xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Seamless Integration with Your Stack
              </h3>
              <p className="text-gray-600 mb-6">
                Our APIs work with any technology stack. Get started with our pre-built SDKs 
                or use our REST APIs directly.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-white text-gray-700">Node.js</Badge>
                <Badge className="bg-white text-gray-700">Python</Badge>
                <Badge className="bg-white text-gray-700">PHP</Badge>
                <Badge className="bg-white text-gray-700">Java</Badge>
                <Badge className="bg-white text-gray-700">C#</Badge>
                <Badge className="bg-white text-gray-700">Go</Badge>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                View Documentation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div>
              <img className='w-full h-64 object-cover rounded-xl'
              src={"laptop.jpeg"} 
              alt={'laptop'}
              >
              
              </img>
                {/* <Image
                height={0}
                width={0}
                src={"/laptop.jpeg"} 
                alt={'laptop'}
                className='w-full h-64 object-cover rounded-xl'
                priority
                unoptimized
                ></Image> */}
            </div>

          </div>
        </div>
  )
}