'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import AnalyticsPage from '../analytics/page'

export default function AdminDashboard(){
  return (
    <AnalyticsPage/>
  )
}