import { supabase } from '@/lib/supabase/client'
import { IBranchService, Branch, BranchStaff, BranchInventory } from './types'

export class SupabaseBranchService implements IBranchService {
  
  async getBranches(): Promise<Branch[]> {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('name')
    
    if (error) throw new Error(error.message)
    return data || []
  }

  async getBranch(id: string): Promise<Branch | null> {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
       if (error.code === 'PGRST116') return null
       throw new Error(error.message)
    }
    return data
  }

  async createBranch(branch: Partial<Branch>): Promise<Branch> {
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
    const { data, error } = await supabase
      .from('branches')
      .update(branch)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  async deleteBranch(id: string): Promise<void> {
    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
  }

  async getBranchStaff(branchId: string): Promise<BranchStaff[]> {
    const { data, error } = await supabase
      .from('branch_staff')
      .select(`
        *,
        user:profiles(first_name, last_name, phone)
      `)
      .eq('branch_id', branchId)
    
    if (error) throw new Error(error.message)
    return data || []
  }

  async assignStaff(branchId: string, email: string, role: string, permissions: string[]): Promise<BranchStaff> {
    // 1. Get User ID by Email (RPC)
    const { data: userId, error: userError } = await supabase
      .rpc('get_user_id_by_email', { email_input: email })
    
    if (userError || !userId) {
      throw new Error('User not found or access denied')
    }

    // 2. Insert Staff
    const { data, error } = await supabase
      .from('branch_staff')
      .insert({
        branch_id: branchId,
        user_id: userId,
        role,
        permissions
      })
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  async removeStaff(branchId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('branch_staff')
      .delete()
      .match({ branch_id: branchId, user_id: userId })
    
    if (error) throw new Error(error.message)
  }

  async updateStaffPermissions(branchId: string, userId: string, permissions: string[]): Promise<BranchStaff> {
    const { data, error } = await supabase
      .from('branch_staff')
      .update({ permissions })
      .match({ branch_id: branchId, user_id: userId })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async getBranchInventory(branchId: string, productId: string): Promise<BranchInventory[]> {
    const { data, error } = await supabase
      .from('branch_inventory')
      .select('*')
      .eq('branch_id', branchId)
      .eq('product_id', productId)
    
    if (error) throw new Error(error.message)
    return data || []
  }

  async updateBranchStock(branchId: string, productId: string, variantId: string | null | undefined, quantity: number): Promise<void> {
    const { error } = await supabase.rpc('upsert_branch_inventory', {
      p_branch_id: branchId,
      p_product_id: productId,
      p_variant_id: variantId || null,
      p_quantity: quantity
    })

    if (error) throw new Error(error.message)
  }
}
