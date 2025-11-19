import { CreditCard, Phone, Wallet, Code2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const stickyScrollContent = [
  {
    title: "Accept Payments through Multiple Channels",
    description: "Cards, Mobile Money, and Bank Transfers.",
    leftContent: (
      <div className="space-y-6">
        <Badge className="bg-orange-100 text-orange-700">Payment Channels</Badge>
        
        <h2 className="text-4xl lg:text-5xl font-bold text-primary-blue leading-tight">
          Accept Payments through 
          <span className="text-orange-500 block mt-2">Multiple Channels</span>
        </h2>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          Cards, Mobile Money, and Bank Transfers.
        </p>

        <div className="space-y-4 pt-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Card Payments</h3>
              <p className="text-sm text-gray-600">Accept Visa, Mastercard, and other major card networks</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mobile Money</h3>
              <p className="text-sm text-gray-600">MTN, Airtel, Zamtel and all major mobile money providers</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bank Transfers</h3>
              <p className="text-sm text-gray-600">Direct bank transfers from all major financial institutions</p>
            </div>
          </div>
        </div>
      </div>
    ),
    content: (
      <div className="h-full w-full flex items-center justify-center">
        <img 
          src="/pay-success.jpg" 
          alt="Multiple Payment Channels" 
          className="h-full w-full object-cover rounded-lg"
        />
      </div>
    ),
  },
  {
    title: "Hosted Checkout",
    description: "A ready-to-use, customizable checkout page that simplifies payment collection with customizable branding.",
    leftContent: (
      <div className="space-y-6">
        <Badge className="bg-blue-100 text-blue-700">Easy Integration</Badge>
        
        <h2 className="text-4xl lg:text-5xl font-bold text-primary-blue leading-tight">
          <span className="text-orange-500">Hosted </span>
          Checkout
        </h2>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          A ready-to-use, customizable checkout page that simplifies payment collection with customizable branding.
        </p>

        <div className="space-y-4 pt-4">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Ready to Use</h3>
              <p className="text-sm text-gray-600">Pre-built checkout page that works out of the box</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Customizable Branding</h3>
              <p className="text-sm text-gray-600">Match your brand with custom colors, logos, and styling</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Secure & Compliant</h3>
              <p className="text-sm text-gray-600">PCI-DSS compliant with enterprise-grade security</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Mobile Optimized</h3>
              <p className="text-sm text-gray-600">Perfect experience across all devices and screen sizes</p>
            </div>
          </div>
        </div>
      </div>
    ),
    content: (
      <div className="h-full w-full flex items-center justify-center">
        <img 
          src="/image.png" 
          alt="Hosted Checkout" 
          className="h-full w-full object-cover rounded-lg"
        />
      </div>
    ),
  },
  {
    title: "APIs Built for Developers",
    description: "Integrate seamless and secure payments with our well-documented APIs. Built for developers, trusted by businesses of all sizes.",
    leftContent: (
      <div className="space-y-6">
        <Badge className="bg-purple-100 text-purple-700">For Developers</Badge>
        
        <h2 className="text-4xl lg:text-5xl font-bold text-primary-blue leading-tight">
          APIs Built for
          <span className="text-orange-500 block mt-2">Developers</span>
        </h2>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          Integrate seamless and secure payments with our well-documented APIs. Built for developers, 
          trusted by businesses of all sizes.
        </p>

        <div className="space-y-4 pt-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">RESTful APIs</h3>
              <p className="text-sm text-gray-600">Clean, intuitive API design with comprehensive documentation</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Multiple SDKs</h3>
              <p className="text-sm text-gray-600">Node.js, Python, PHP, Java, C#, Go and more</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Sandbox Environment</h3>
              <p className="text-sm text-gray-600">Test thoroughly before going live with our sandbox</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Webhooks & Real-time Updates</h3>
              <p className="text-sm text-gray-600">Get instant notifications for all transaction events</p>
            </div>
          </div>
        </div>
      </div>
    ),
    content: (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="w-full">
          <div className="bg-gray-900 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="ml-2 text-gray-400 text-xs">Probase Payment Gateway API</span>
            </div>
            <pre className="text-green-400 text-[10px] leading-relaxed overflow-x-auto">
{`// Initialize Payment Gateway
const payment = new PaymentGateway({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Process Payment
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
        </div>
      </div>
    ),
  },
];

// Extended content with feature details for each section
export const detailedContent = [
  {
    badge: { text: "Payment Channels", className: "bg-orange-100 text-orange-700" },
    title: "Accept Payments through Multiple Channels",
    subtitle: "Cards, Mobile Money, and Bank Transfers.",
    features: [
      {
        icon: CreditCard,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        title: "Card Payments",
        description: "Accept Visa, Mastercard, and other major card networks"
      },
      {
        icon: Phone,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        title: "Mobile Money",
        description: "MTN, Airtel, Zamtel and all major mobile money providers"
      },
      {
        icon: Wallet,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Bank Transfers",
        description: "Direct bank transfers from all major financial institutions"
      }
    ]
  },
  {
    badge: { text: "Easy Integration", className: "bg-blue-100 text-blue-700" },
    title: "Hosted Checkout",
    subtitle: "A ready-to-use, customizable checkout page that simplifies payment collection with customizable branding.",
    features: [
      {
        icon: CheckCircle2,
        iconColor: "text-orange-500",
        title: "Ready to Use",
        description: "Pre-built checkout page that works out of the box"
      },
      {
        icon: CheckCircle2,
        iconColor: "text-orange-500",
        title: "Customizable Branding",
        description: "Match your brand with custom colors, logos, and styling"
      },
      {
        icon: CheckCircle2,
        iconColor: "text-orange-500",
        title: "Secure & Compliant",
        description: "PCI-DSS compliant with enterprise-grade security"
      },
      {
        icon: CheckCircle2,
        iconColor: "text-orange-500",
        title: "Mobile Optimized",
        description: "Perfect experience across all devices and screen sizes"
      }
    ]
  },
  {
    badge: { text: "For Developers", className: "bg-purple-100 text-purple-700" },
    title: "APIs Built for Developers",
    subtitle: "Integrate seamless and secure payments with our well-documented APIs. Built for developers, trusted by businesses of all sizes.",
    features: [
      {
        icon: Code2,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        title: "RESTful APIs",
        description: "Clean, intuitive API design with comprehensive documentation"
      },
      {
        icon: CheckCircle2,
        iconColor: "text-orange-500",
        title: "Multiple SDKs",
        description: "Node.js, Python, PHP, Java, C#, Go and more"
      },
      {
        icon: CheckCircle2,
        iconColor: "text-orange-500",
        title: "Sandbox Environment",
        description: "Test thoroughly before going live with our sandbox"
      },
      {
        icon: CheckCircle2,
        iconColor: "text-orange-500",
        title: "Webhooks & Real-time Updates",
        description: "Get instant notifications for all transaction events"
      }
    ]
  }
];
