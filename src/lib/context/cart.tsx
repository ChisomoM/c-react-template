'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react'
import { SupabaseCartService } from '@/services/SupabaseCartService'
import { LocalStorageCartService } from '@/services/LocalStorageCartService'
import { CartItem, ICartService, Product } from '@/services/types'
import { toast } from 'sonner'
import { useAuth } from '@/lib/context/useAuth'

interface CartContextValue {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isLoading: authLoading } = useAuth()
  
  // Decide which service to use based on auth state
  // We recreate this object when user changes, effectively switching strategies
  const cartService = useMemo<ICartService>(() => {
    // While auth is loading, we might want to default to something or wait?
    // If we default to LocalStorage, it's fine for guests. 
    // If it turns out we are logged in, we switch to Supabase.
    if (user) {
      return new SupabaseCartService()
    }
    return new LocalStorageCartService()
  }, [user])

  const syncCart = useCallback(async () => {
    try {
      if (authLoading) return // Wait for auth
      const cartItems = await cartService.sync()
      setItems(cartItems)
    } catch (error) {
      console.error('Failed to sync cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [cartService, authLoading])

  // Effect to handle merging guest cart into user cart on login
  useEffect(() => {
    const handleLoginMerge = async () => {
      // Only run if we have a user and auth is done loading
      if (user && !authLoading) {
        // Check for items in local storage (guest cart)
        const localService = new LocalStorageCartService()
        const guestItems = await localService.sync()
        
        if (guestItems.length > 0) {
          try {
            const supabaseService = new SupabaseCartService()
            
            // Add all guest items to supabase cart
            // Using a loop here - optimizing with a bulk add would be better in service
            // but for now relying on existing addItem single method
            for (const item of guestItems) {
               // We need to populate product details if they are missing, but addItem only needs productId and quantity/variant
               await supabaseService.addItem(item)
            }
            
            // Clear guest cart
            await localService.clearCart()
            toast.success('Your guest cart has been merged with your account.')
            
            // Re-sync to get fresh state from supabase
            await syncCart()
          } catch (error) {
            console.error('Failed to merge guest cart', error)
            toast.error('Failed to merge guest cart items')
          }
        } else {
            // Just sync normally
            syncCart()
        }
      } else if (!user && !authLoading) {
        // If guest, ensure we are synced with local storage
        syncCart()
      }
    }

    handleLoginMerge()
  }, [user, authLoading, syncCart])


  const addItem = useCallback(async (item: CartItem) => {
    try {
      await cartService.addItem(item)
      await syncCart()
      toast.success('Item added to cart')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item'
      toast.error(message)
      throw error
    }
  }, [cartService, syncCart])

  const removeItem = useCallback(async (productId: string) => {
    try {
      await cartService.removeItem(productId)
      await syncCart()
      toast.success('Item removed from cart')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item'
      toast.error(message)
      throw error
    }
  }, [cartService, syncCart])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      await cartService.updateQuantity(productId, quantity)
      await syncCart()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update quantity'
      toast.error(message)
      throw error
    }
  }, [cartService, syncCart])

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart()
      setItems([])
      toast.success('Cart cleared')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear cart'
      toast.error(message)
      throw error
    }
  }, [cartService])

  // Need to ensure syncCart is called? The merge effect handles it.
  // But if dependencies like cartService change (which depends on user), it will be called.

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      syncCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
