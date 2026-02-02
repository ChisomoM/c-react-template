'use client'

import { useEffect, useState, use } from 'react'
import { useParams } from 'next/navigation'
import { ModifierForm } from '@/components/admin/modifiers/ModifierForm'
import { SupabaseModifierService } from '@/services/SupabaseModifierService'
import { Modifier } from '@/services/types'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditModifierPage() {
  const params = useParams()
  const id = params.id as string
  const [modifier, setModifier] = useState<Modifier | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadModifier = async () => {
      try {
        setIsLoading(true)
        const modifierService = new SupabaseModifierService()
        const data = await modifierService.getModifier(id)
        if (!data) {
          toast.error('Modifier not found')
          return
        }
        setModifier(data)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load modifier'
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadModifier()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!modifier) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Modifier not found</h1>
        <Link href="/admin/modifiers" className="text-blue-500 hover:underline mt-4 block">
          Back to modifiers
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <ModifierForm initialData={modifier} />
    </div>
  )
}
