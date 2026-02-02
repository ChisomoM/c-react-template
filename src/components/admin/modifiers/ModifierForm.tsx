'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { SupabaseModifierService } from '@/services/SupabaseModifierService'
import { Modifier } from '@/services/types'

// Schema with explicit required types to avoid optional inference issues
const modifierFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price_zmw: z.number().min(0, 'Price must be positive'),
  cost_price_zmw: z.number().min(0).optional(),
  sku: z.string().optional(),
  track_inventory: z.boolean(),
  stock_quantity: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0),
  min_quantity: z.number().int().min(0),
  max_quantity: z.number().int().min(1),
  is_active: z.boolean(),
  is_global: z.boolean(),
  sort_order: z.number().int().min(0),
})

type ModifierFormValues = z.infer<typeof modifierFormSchema>

interface ModifierFormProps {
  initialData?: Modifier | null
}

export function ModifierForm({ initialData }: ModifierFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modifierService = new SupabaseModifierService()

  const form = useForm<ModifierFormValues>({
    resolver: zodResolver(modifierFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          price_zmw: initialData.price_zmw,
          cost_price_zmw: initialData.cost_price_zmw || 0,
          sku: initialData.sku || '',
          track_inventory: initialData.track_inventory,
          stock_quantity: initialData.stock_quantity,
          low_stock_threshold: initialData.low_stock_threshold || 10,
          min_quantity: initialData.min_quantity,
          max_quantity: initialData.max_quantity,
          is_active: initialData.is_active,
          is_global: initialData.is_global,
          sort_order: initialData.sort_order,
        }
      : {
          name: '',
          description: '',
          price_zmw: 0,
          cost_price_zmw: 0,
          sku: '',
          track_inventory: false,
          stock_quantity: 0,
          low_stock_threshold: 10,
          min_quantity: 0,
          max_quantity: 1,
          is_active: true,
          is_global: false,
          sort_order: 0,
        },
  })

  const onSubmit = async (values: ModifierFormValues) => {
    try {
      setIsSubmitting(true)

      if (initialData) {
        await modifierService.updateModifier(initialData.id, values)
        toast.success('Modifier updated successfully')
      } else {
        await modifierService.createModifier(values)
        toast.success('Modifier created successfully')
      }

      router.push('/admin/modifiers')
      router.refresh()
    } catch (error) {
      console.error(error)
      const message = error instanceof Error ? error.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const trackInventory = form.watch('track_inventory')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {initialData ? 'Edit Modifier' : 'New Modifier'}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Modifier
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Extra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a detailed description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="MOD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="price_zmw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (ZMW)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        The additional price for this modifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost_price_zmw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormDescription>For profit calculation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quantity Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="min_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormDescription>Minimum customer must select</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormDescription>Maximum customer can select</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Inventory & Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="track_inventory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Track Inventory</FormLabel>
                        <FormDescription>
                          Enable stock tracking for this modifier
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {trackInventory && (
                  <>
                    <FormField
                      control={form.control}
                      name="stock_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="low_stock_threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Stock Threshold</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Alert when stock falls below this number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_global"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Global Modifier</FormLabel>
                        <FormDescription>
                          Available for all products automatically
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Make this modifier visible to customers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first (or drag-and-drop on list page)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
