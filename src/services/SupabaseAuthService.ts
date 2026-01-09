import { supabase } from '@/lib/supabase/client'
import { IAuthService, User, LoginCredentials, RegisterData } from './types'

export class SupabaseAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('Login failed')
    }

    // Fetch additional user data from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      throw new Error(profileError.message)
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      role: profile.role,
    }
  }

  async register(data: RegisterData): Promise<User> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!authData.user) {
      throw new Error('Registration failed')
    }

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        role: 'customer', // default role
      })

    if (profileError) {
      throw new Error(profileError.message)
    }

    return {
      id: authData.user.id,
      email: authData.user.email!,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      role: 'customer',
    }
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  async getUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      role: profile.role,
    }
  }
}