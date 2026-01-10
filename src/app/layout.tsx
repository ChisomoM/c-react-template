import { Sora } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/context/auth'
import { CartProvider } from '@/lib/context/cart'
import { Toaster } from 'sonner'

const sora = Sora({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-sora',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${sora.className} font-sora antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}