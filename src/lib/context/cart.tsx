'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { SupabaseCartService } from '@/services/SupabaseCartService'
import { CartItem } from '@/services/types'
import { toast } from 'sonner'

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
  const cartService = new SupabaseCartService()

  const syncCart = useCallback(async () => {
    try {
      const cartItems = await cartService.sync()
      setItems(cartItems)
    } catch (error) {
      console.error('Failed to sync cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [cartService])

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

  useEffect(() => {
    syncCart()
  }, [syncCart])

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