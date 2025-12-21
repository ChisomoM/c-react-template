import type { Metadata } from 'next'
import { siteMetadata } from '@/lib/metadata'
import HomeClient from './HomeClient'

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata
}

export default function Home() {
  return <HomeClient />
}