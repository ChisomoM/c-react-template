'use client'

import { useEffect, useState, use } from 'react'
import { useParams } from 'next/navigation'
import { ProductForm } from '@/components/admin/products/ProductForm'
import { SupabaseProductService } from '@/services/SupabaseProductService'
import { Product } from '@/services/types'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditProductPage() {
  const params = useParams()
  const id = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) return;
        
        try {
            const service = new SupabaseProductService()
            const data = await service.getProduct(id)
            if (data) {
                setProduct(data)
            } else {
                toast.error('Product not found')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to load product')
        } finally {
            setIsLoading(false)
        }
    }
    
    fetchProduct()
  }, [id])

  if (isLoading) {
      return (
          <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
      )
  }

  if (!product) {
      return (
          <div className="p-8">
              <h1 className="text-2xl font-bold text-red-500">Product not found</h1>
              <Link href="/admin/products" className="text-blue-500 hover:underline mt-4 block">
                  Back to products
              </Link>
          </div>
      )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
            <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </Link>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product details and inventory</p>
        </div>
      </div>
      
      <ProductForm initialData={product} />
    </div>
  )
}
