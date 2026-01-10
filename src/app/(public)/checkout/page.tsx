'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/cart'
import { useAuth } from '@/lib/context/useAuth'
import { SupabaseOrderService } from '@/services/SupabaseOrderService'
import { MockOrderService } from '@/services/MockOrderService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, CreditCard, Smartphone } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function CheckoutPage() {
  const { items, clearCart, isLoading: cartLoading } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  // Use mock service for now as requested
  // const orderService = new SupabaseOrderService()
  const orderService = new MockOrderService()
  
  const [loading, setLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    area: '',
    city: 'Lusaka',
    phone: '',
  })

  // Initialize form data when user loads
  useEffect(() => {
    // Only update defaults if state is still empty (or roughly empty)
    // to avoid overwriting user input if auth loads late
    if (user && !authLoading) {
      setFormData(prev => {
        // Only update if previous value is empty, so we don't clear what user typed
        return {
          ...prev,
          firstName: prev.firstName || user.firstName || '',
          lastName: prev.lastName || user.lastName || '',
          email: prev.email || user.email || '',
          phone: prev.phone || user.mobile || ''
        }
      })
    }
  }, [user, authLoading])

  // Redirect if cart is empty after loading
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
       router.push('/cart')
    }
  }, [items, cartLoading, router])

  if (cartLoading || (items.length === 0)) {
     return (
        <div className="container mx-auto px-4 py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4">Loading checkout...</p>
        </div>
     )
  }

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price_zmw || 0) * item.quantity, 0)
  const shippingCost = 50 // Fixed shipping for now
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
        toast.error('Email is required for receipt')
        return
    }

    setShowPaymentDialog(true)
  }

  const handlePlaceOrder = async (method: 'card' | 'mobile_money') => {
    setLoading(true)
    setShowPaymentDialog(false)

    try {
      const shipping_address = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        area: formData.area,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
      }

      await orderService.createOrder({
        total_zmw: total,
        shipping_address: shipping_address,
        payment_method: method,
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
      console.error(error)
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
              <form id="checkout-form" onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="For order confirmation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id || item.product_id} className="flex justify-between text-sm">
                    <span className="max-w-[70%] truncate">
                      {item.quantity}x {item.product?.title}
                    </span>
                    <span>ZMW {((item.product?.price_zmw || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>ZMW {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>ZMW {shippingCost.toFixed(2)}</span>
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
                  'Proceed to Payment'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you would like to pay for your order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
             <Button 
               variant="outline" 
               className="h-32 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 hover:border-primary transition-colors"
               onClick={() => handlePlaceOrder('card')}
               disabled={loading}
             >
                <CreditCard className="h-10 w-10 text-primary" />
                <span className="text-lg font-semibold">Card</span>
             </Button>

             <Button 
               variant="outline" 
               className="h-32 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 hover:border-primary transition-colors"
               onClick={() => handlePlaceOrder('mobile_money')}
               disabled={loading}
             >
                <Smartphone className="h-10 w-10 text-primary" />
                <span className="text-lg font-semibold">Mobile Money</span>
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
