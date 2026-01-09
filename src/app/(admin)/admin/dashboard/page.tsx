'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // In a real app, you'd fetch these from your API
        // For now, we'll set placeholder values
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          lowStockProducts: 0
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your e-commerce admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Products</h3>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-600 mt-1">Active products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Orders</h3>
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-600 mt-1">All-time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Revenue</h3>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ZMW {stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">All-time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Low Stock Items</h3>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
            <p className="text-xs text-gray-600 mt-1">Products with stock &lt; 5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Getting Started</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Set up your Supabase project</h4>
              <p className="text-sm text-gray-600">
                Create a Supabase project and run the SQL scripts in <code className="bg-gray-100 px-1.5 py-0.5 rounded">src/scripts/schema.sql</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded">src/scripts/seed_data.sql</code>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Configure environment variables</h4>
              <p className="text-sm text-gray-600">
                Update <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env.local</code> with your Supabase project URL and anon key
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Add products</h4>
              <p className="text-sm text-gray-600">
                Navigate to the Products page to start adding items to your catalog
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}