import { supabase } from '@/lib/supabase/client'
import { IUserService, User } from './types'

export class SupabaseUserService implements IUserService {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(error.message)
    }

    return data
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(user)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  async deleteUser(id: string): Promise<void> {
    // Soft delete by setting a deleted flag, or hard delete if no dependencies
    // For now, we'll do a hard delete, but in production consider soft delete
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  }
}