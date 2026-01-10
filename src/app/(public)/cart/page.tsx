'use client'

import { useCart } from '@/lib/context/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, updateQuantity, isLoading } = useCart()
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price_zmw || 0) * item.quantity
  }, 0)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading cart...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <div className="flex justify-center">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        <Link href="/shop">
          <Button className="mt-4">Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product_id + JSON.stringify(item.variant_selection)}>
              <CardContent className="p-4 flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                   {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                   ) : (
                     <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                   )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.product?.title || 'Unknown Product'}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.product?.description}</p>
                    </div>
                    <p className="font-semibold">
                      ZMW {((item.product?.price_zmw || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeItem(item.product_id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>ZMW {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>ZMW {subtotal.toFixed(2)}</span>
              </div>
              
              <Button className="w-full" size="lg" onClick={() => router.push('/checkout')}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
