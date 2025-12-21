import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Home - React Template',
  description: 'A modern React template with Next.js, TypeScript, and Tailwind CSS',
}

export default function Page() {
  return <HomeClient />
}
