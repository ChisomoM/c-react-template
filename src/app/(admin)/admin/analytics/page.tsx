'use client'

import { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SupabaseAnalyticsService, AnalyticsSummary, SalesTrend, ProductPerformance, InventoryAlert, AreaSales } from '@/services/SupabaseAnalyticsService'
import { DateRangePicker } from '@/components/ui/date-range-picker' 
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, TrendingDown, Package, AlertTriangle, MapPin, DollarSign, RefreshCw } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  
  const [comparisonRange, setComparisonRange] = useState<DateRange | undefined>({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
  })

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([])
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([])
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([])
  const [areaSales, setAreaSales] = useState<AreaSales[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const analyticsService = new SupabaseAnalyticsService()
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    loadData()
  }, [dateRange])

  const loadData = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    try {
      setIsLoading(true)
      setError(null)
      
      const [summaryData, trendData, productsData, alertsData, areaData] = await Promise.all([
        analyticsService.getSummary(dateRange.from, dateRange.to),
        analyticsService.getSalesTrend(dateRange.from, dateRange.to),
        analyticsService.getTopProducts(dateRange.from, dateRange.to),
        analyticsService.getInventoryAlerts(),
        analyticsService.getSalesByArea(dateRange.from, dateRange.to),
      ])

      setSummary(summaryData)
      setSalesTrend(trendData)
      setTopProducts(productsData)
      setInventoryAlerts(alertsData)
      setAreaSales(areaData)
    } catch (err: any) {
      console.error('Failed to load analytics:', err)
      setError(err.message || 'Failed to load analytics data. Please ensure the database schema is updated.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleExport = () => {
      // Basic CSV export logic would go here
      alert("Export functionality to be implemented: generate CSV from current data state.");
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Analytics</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button variant="outline" onClick={() => loadData()}>
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Overview of your store's performance.</p>
        </div>
        <div className="flex items-center gap-2">
           <DateRangePicker date={dateRange} setDate={setDateRange} />
           <Button onClick={handleExport}>
             <Download className="mr-2 h-4 w-4" />
             Export
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ZMW {summary?.revenue?.toLocaleString() ?? '0'}</div>
            <p className="text-xs text-muted-foreground">Net Profit: ZMW {summary?.netProfit?.toLocaleString() ?? '0'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.ordersCount ?? '0'}</div>
            <div className="flex text-xs text-muted-foreground gap-2">
               <span className="text-orange-500">{summary?.pendingOrders ?? '0'} Pending</span>
               <span>•</span>
               <span className="text-green-600">{summary?.deliveredOrders ?? '0'} Delivered</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.returnRate?.toFixed(1) ?? '0.0'}%</div>
            <p className="text-xs text-muted-foreground">Rate of returned orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Health</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryAlerts.length}</div>
            <p className="text-xs text-muted-foreground text-red-500">Items Low Stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Trend Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `ZMW ${value}`}
                  />
                  <Tooltip 
                     formatter={(value: any) => [`ZMW ${Number(value).toLocaleString()}`, 'Revenue']}
                     labelFormatter={(label: any) => format(new Date(label), 'PPP')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>By revenue in selected period</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-8">
                {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                        <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">{product.title}</p>
                            <p className="text-sm text-muted-foreground">{product.quantitySold} sold</p>
                        </div>
                        <div className="font-medium">ZMW {product.revenue.toLocaleString()}</div>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
          {/* Sales by Area */}
          <Card>
              <CardHeader>
                  <CardTitle>Sales by Area</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={areaSales} layout="vertical" margin={{ left: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                              <XAxis type="number" hide />
                              <YAxis dataKey="area" type="category" width={100} tick={{fontSize: 12}} />
                              <Tooltip formatter={(value: any) => [`ZMW ${Number(value).toLocaleString()}`, 'Revenue']} />
                              <Bar dataKey="revenue" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>
          
          {/* Low Stock Alerts Table */}
          <Card>
              <CardHeader>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>Items below threshold needing reorder</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {inventoryAlerts.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">Inventory levels are healthy.</p>
                      ) : (
                          inventoryAlerts.map(item => (
                              <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                  <div>
                                      <p className="font-medium text-sm">{item.title}</p>
                                      <p className="text-xs text-red-500 font-medium">Only {item.stock_quantity} left</p>
                                  </div>
                                  <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                                      Threshold: {item.low_stock_threshold}
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
