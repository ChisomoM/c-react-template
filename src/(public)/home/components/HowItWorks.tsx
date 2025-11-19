import { UserPlus, Code2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const steps = [
  {
    key: 'signup',
    number: '01',
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account and verify your business in minutes. Quick KYC process with instant approval for most businesses.',
    color: 'orange',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    delay: 0.1,
  },
  {
    key: 'integrate',
    number: '02',
    icon: Code2,
    title: 'Integrate Easily',
    description: 'Use our REST APIs or SDKs to connect in minutes. Comprehensive documentation and code samples for all major languages.',
    color: 'blue',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    delay: 0.2,
  },
  {
    key: 'start',
    number: '03',
    icon: Zap,
    title: 'Start Accepting Payments',
    description: 'Go live and start collecting payments instantly. Accept cards, mobile money, and bank transfers from day one.',
    color: 'green',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    delay: 0.3,
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works" className="py-20 bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-orange-100 text-orange-700 mb-4">Getting Started</Badge>
          <h2 id="how-it-works" className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It <span className="text-orange-500">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get started with our payment gateway in three simple steps. From sign-up to your first transaction, 
            we've made it incredibly simple to integrate and start accepting payments.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
              >
                <Card className="relative h-full border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  
                  <CardHeader className="pt-8">
                    <div className={`w-16 h-16 ${step.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-8 h-8 ${step.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        
      </div>
    </section>
  );
}
