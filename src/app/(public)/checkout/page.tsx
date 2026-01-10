'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/cart'
import { useAuth } from '@/lib/context/useAuth'
import { SupabaseOrderService } from '@/services/SupabaseOrderService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const orderService = new SupabaseOrderService()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    address: '',
    area: '',
    city: 'Lusaka',
    phone: user?.mobile || '',
  })

  // Redirect if cart is empty
  if (items.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart')
    return null
  }

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price_zmw || 0) * item.quantity, 0)
  const shippingCost = 50 // Fixed shipping for now
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error('Please login to place an order')
        router.push('/login?redirect=/checkout')
        return
      }

      const shipping_address = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        area: formData.area,
        city: formData.city,
        phone: formData.phone,
      }

      await orderService.createOrder({
        total_zmw: total,
        shipping_address: shipping_address,
        items: items.map(item => ({
             product_id: item.product_id,
             quantity: item.quantity,
             price_at_purchase: item.product?.price_zmw || 0,
             variant_selection: item.variant_selection
        }))
      })

      await clearCart()
      router.push('/checkout/success')
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Start typing your address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address, House number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Northmead"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-md bg-gray-50 text-sm text-gray-600">
                    Payment is currently simulated. No actual charge will be made.
                    <br/>
                    <strong>Cash on Delivery</strong> is selected by default.
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <div className="flex gap-2">
                        <span className="text-gray-500">{item.quantity}x</span>
                        <span className="font-medium truncate max-w-[150px]">{item.product?.title}</span>
                    </div>
                    <span>ZMW {((item.product?.price_zmw || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>ZMW {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>ZMW {shippingCost.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>ZMW {total.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay ZMW ${total.toFixed(2)}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
