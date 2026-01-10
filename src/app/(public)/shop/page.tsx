import { Suspense } from 'react'
import ShopPageContent from './ShopPageContent'

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  )
}