'use client'

import { ProductForm } from '@/components/admin/products/ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
        <p className="text-gray-600">Create a new product</p>
      </div>
      <ProductForm />
    </div>
  )
}
