import { supabase } from '@/lib/supabase/client'
import { IComboService, Combo } from './types'

export class SupabaseComboService implements IComboService {
  async getCombos(): Promise<Combo[]> {
    const { data, error } = await supabase
      .from('combos')
      .select(`
        *,
        items:combo_items(
          *,
          product:products(
             *,
             variants:product_variants(*)
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  async getCombo(id: string): Promise<Combo | null> {
    const { data, error } = await supabase
      .from('combos')
      .select(`
        *,
        items:combo_items(
          *,
          product:products(
             *,
             variants:product_variants(*)
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(error.message)
    }

    return data
  }
}
