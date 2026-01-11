'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/useAuth'
import { User, Package, MapPin, CreditCard, Bell, Loader2, Heart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock Data Types
interface Address {
  id: string
  label: string
  street: string
  area: string
  city: string
  phone: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: 'visa' | 'mastercard' | 'mobile'
  last4: string
  expiry?: string
  isDefault: boolean
}

interface OrderItem {
  id: string
  date: string
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  itemCount: number
}

interface Preferences {
  newsletter: boolean
  orderUpdates: boolean
  promotions: boolean
}

interface WishlistItem {
  id: string
  productId: string
  title: string
  price: number
  image?: string
  addedDate: string
}

// Mock Data
const mockOrders: OrderItem[] = [
  { id: 'ORD-001', date: '2026-01-08', total: 450.00, status: 'delivered', itemCount: 3 },
  { id: 'ORD-002', date: '2026-01-05', total: 1250.00, status: 'shipped', itemCount: 2 },
  { id: 'ORD-003', date: '2025-12-28', total: 780.50, status: 'delivered', itemCount: 4 },
  { id: 'ORD-004', date: '2025-12-15', total: 320.00, status: 'delivered', itemCount: 1 },
]

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: 'Plot 1234, Cairo Road',
    area: 'Northmead',
    city: 'Lusaka',
    phone: '+260 97 123 4567',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    street: 'Mass Media Complex',
    area: 'Alick Nkhata Road',
    city: 'Lusaka',
    phone: '+260 97 765 4321',
    isDefault: false,
  },
]

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'mobile',
    last4: '1234',
    isDefault: false,
  },
]

const mockPreferences: Preferences = {
  newsletter: true,
  orderUpdates: true,
  promotions: false,
}

const mockWishlist: WishlistItem[] = [
  // Empty for now - can be populated later
]

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: OrderItem['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'paid':
        return 'bg-gold-light text-gold-dark'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="font-sora font-bold text-5xl md:text-6xl text-charcoal mb-4 tracking-tight">
              My Profile
            </h1>
            <p className="font-sora font-light text-lg text-gray-600">
              Manage your account details and view your order history
            </p>
          </div>

          {/* Personal Information */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-gold-primary" />
              <h2 className="font-sora font-semibold text-2xl md:text-3xl text-charcoal">
                Personal Information
              </h2>
            </div>
            
            <div className="bg-cream p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-sora font-light text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-sora font-normal text-base text-charcoal">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="font-sora font-light text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="font-sora font-normal text-base text-charcoal">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="font-sora font-light text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-sora font-normal text-base text-charcoal">
                    January 2026
                  </p>
                </div>
                <div>
                  <p className="font-sora font-light text-sm text-gray-600 mb-1">Account Status</p>
                  <Badge className="bg-green-100 text-green-800 font-sora font-normal">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-16" />

          {/* Order History */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-gold-primary" />
              <h2 className="font-sora font-semibold text-2xl md:text-3xl text-charcoal">
                Order History
              </h2>
            </div>

            <div className="border border-gray-300">
              <Table>
                <TableHeader>
                  <TableRow className="bg-cream">
                    <TableHead className="font-sora font-semibold text-sm text-charcoal">
                      Order ID
                    </TableHead>
                    <TableHead className="font-sora font-semibold text-sm text-charcoal">
                      Date
                    </TableHead>
                    <TableHead className="font-sora font-semibold text-sm text-charcoal">
                      Items
                    </TableHead>
                    <TableHead className="font-sora font-semibold text-sm text-charcoal">
                      Total
                    </TableHead>
                    <TableHead className="font-sora font-semibold text-sm text-charcoal">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-cream/50 transition-colors">
                      <TableCell className="font-sora font-semibold text-sm text-charcoal">
                        {order.id}
                      </TableCell>
                      <TableCell className="font-sora font-light text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-sora font-light text-sm text-gray-900">
                        {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                      </TableCell>
                      <TableCell className="font-sora font-normal text-sm text-charcoal">
                        ZMW {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} font-sora font-normal`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <Separator className="my-16" />

          {/* Wishlist */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-gold-primary" />
              <h2 className="font-sora font-semibold text-2xl md:text-3xl text-charcoal">
                Wishlist
              </h2>
            </div>

            {mockWishlist.length === 0 ? (
              <div className="border border-gray-300 p-16 text-center">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-sora font-semibold text-lg text-charcoal mb-2">
                  Your wishlist is empty
                </h3>
                <p className="font-sora font-light text-sm text-gray-600 max-w-md mx-auto">
                  Save items you love for later. Browse our collection and add your favorites to your wishlist.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockWishlist.map((item) => (
                  <div key={item.id} className="border border-gray-300 p-4 group hover:shadow-lg transition-shadow">
                    {item.image && (
                      <div className="aspect-[4/5] bg-cream mb-4 relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="font-sora font-semibold text-base text-charcoal mb-2">
                      {item.title}
                    </h3>
                    <p className="font-sora font-normal text-sm text-gold-dark">
                      ZMW {item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <Separator className="my-16" />

          {/* Saved Addresses */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-gold-primary" />
              <h2 className="font-sora font-semibold text-2xl md:text-3xl text-charcoal">
                Saved Addresses
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAddresses.map((address) => (
                <div key={address.id} className="border border-gray-300 p-6 relative">
                  {address.isDefault && (
                    <Badge className="absolute top-4 right-4 bg-gold-light text-gold-dark font-sora font-normal">
                      Default
                    </Badge>
                  )}
                  <h3 className="font-sora font-semibold text-lg text-charcoal mb-3">
                    {address.label}
                  </h3>
                  <p className="font-sora font-light text-sm text-gray-900 leading-relaxed">
                    {address.street}<br />
                    {address.area}<br />
                    {address.city}<br />
                    {address.phone}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-16" />

          {/* Payment Methods */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-6 w-6 text-gold-primary" />
              <h2 className="font-sora font-semibold text-2xl md:text-3xl text-charcoal">
                Payment Methods
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPaymentMethods.map((method) => (
                <div key={method.id} className="border border-gray-300 p-6 relative">
                  {method.isDefault && (
                    <Badge className="absolute top-4 right-4 bg-gold-light text-gold-dark font-sora font-normal">
                      Default
                    </Badge>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <h3 className="font-sora font-semibold text-lg text-charcoal">
                      {method.type === 'visa'
                        ? 'Visa'
                        : method.type === 'mastercard'
                        ? 'Mastercard'
                        : 'Mobile Money'}
                    </h3>
                  </div>
                  <p className="font-sora font-light text-sm text-gray-900">
                    •••• •••• •••• {method.last4}
                  </p>
                  {method.expiry && (
                    <p className="font-sora font-light text-sm text-gray-600 mt-1">
                      Expires {method.expiry}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-16" />

          {/* Preferences */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-gold-primary" />
              <h2 className="font-sora font-semibold text-2xl md:text-3xl text-charcoal">
                Preferences
              </h2>
            </div>

            <div className="bg-cream p-8 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-300 last:border-b-0">
                <div>
                  <p className="font-sora font-normal text-base text-charcoal">Newsletter</p>
                  <p className="font-sora font-light text-sm text-gray-600">
                    Receive our latest news and exclusive offers
                  </p>
                </div>
                <Badge
                  className={`${
                    mockPreferences.newsletter
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  } font-sora font-normal`}
                >
                  {mockPreferences.newsletter ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-300 last:border-b-0">
                <div>
                  <p className="font-sora font-normal text-base text-charcoal">Order Updates</p>
                  <p className="font-sora font-light text-sm text-gray-600">
                    Get notified about your order status
                  </p>
                </div>
                <Badge
                  className={`${
                    mockPreferences.orderUpdates
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  } font-sora font-normal`}
                >
                  {mockPreferences.orderUpdates ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-300 last:border-b-0">
                <div>
                  <p className="font-sora font-normal text-base text-charcoal">Promotions</p>
                  <p className="font-sora font-light text-sm text-gray-600">
                    Receive special offers and promotional campaigns
                  </p>
                </div>
                <Badge
                  className={`${
                    mockPreferences.promotions
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  } font-sora font-normal`}
                >
                  {mockPreferences.promotions ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
