import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Home - Zambian E-commerce',
  description: 'Premium fashion and accessories for the modern Zambian gentleman',
}

export default function Page() {
  return <HomeClient />
}
