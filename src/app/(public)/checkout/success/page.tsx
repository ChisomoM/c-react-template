'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
      
      <p className="text-gray-600 max-w-md">
        Thank you for your purchase. We have received your order and we will contact you shortly to confirm delivery details.
      </p>

      <div className="flex gap-4 pt-4">
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
        <Link href="/">
           <Button variant="outline">Go to Home</Button>
        </Link>
      </div>
    </div>
  )
}
