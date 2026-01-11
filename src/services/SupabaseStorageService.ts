import { supabase } from '@/lib/supabase/client'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export class SupabaseStorageService {
  private bucket = 'products'

  private async getS3Client(): Promise<S3Client> {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      throw new Error('No authenticated session')
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Extract project ref from URL (e.g. https://projectref.supabase.co)
    const projectRef = supabaseUrl.match(/https:\/\/(.*?)\./)?.[1] 

    if (!projectRef) {
        throw new Error('Could not extract project reference from Supabase URL')
    }

    // S3 Protocol Endpoint: https://<project_ref>.storage.supabase.co/storage/v1/s3
    const endpoint = `https://${projectRef}.storage.supabase.co/storage/v1/s3`

    return new S3Client({
      forcePathStyle: true,
      region: 'us-east-1', // Region is required but ignored by Supabase
      endpoint: endpoint,
      credentials: {
        accessKeyId: projectRef,
        secretAccessKey: anonKey,
        sessionToken: session.access_token,
      },
    })
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const client = await this.getS3Client()

    // Convert File to Uint8Array to avoid "readableStream.getReader is not a function"
    // errors in browser environments where the AWS SDK might struggle with File streams
    // inside the flexible checksums middleware.
    const arrayBuffer = await file.arrayBuffer()
    const body = new Uint8Array(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: path,
      Body: body,
      ContentType: file.type,
      CacheControl: '3600',
    })

    try {
      await client.send(command)
    } catch (error) {
       console.error('S3 Upload Error:', error)
       throw new Error(`Failed to upload file using S3 protocol: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Manually construct the public URL to avoid 404s/formatting issues
    // Standard format: https://<project_ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${this.bucket}/${path}`
    
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
    let relativePath = path
    if (path.includes('/public/products/')) {
      relativePath = path.split('/public/products/')[1]
    }

    const client = await this.getS3Client()

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: relativePath,
    })

    try {
      await client.send(command)
    } catch (error) {
       console.error('S3 Delete Error:', error)
       throw new Error(`Failed to delete file using S3 protocol: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
