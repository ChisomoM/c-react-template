import { supabase } from '@/lib/supabase/client'

export class SupabaseStorageService {
  private bucket = 'products'

  async uploadFile(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(data.path)

    return publicUrl
  }

  async uploadImages(files: File[], productId: string): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const extension = file.name.split('.').pop()
      const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`
      return this.uploadFile(file, fileName)
    })

    return Promise.all(uploadPromises)
  }

  async deleteFile(path: string): Promise<void> {
    // Extract path from URL if full URL is provided
    // Expected format: .../storage/v1/object/public/products/path/to/file.jpg
    let relativePath = path
    if (path.includes('/public/products/')) {
      relativePath = path.split('/public/products/')[1]
    }

    const { error } = await supabase.storage
      .from(this.bucket)
      .remove([relativePath])

    if (error) {
      throw new Error(error.message)
    }
  }
}
