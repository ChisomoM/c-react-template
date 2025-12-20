import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CalendarIcon, Download, Filter, TrendingUp, BarChart3, PieChart as PieChartIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAnalyticsData, type AnalyticsFilters } from '@/hooks/useAnalyticsData';
import { exportToCSV } from '@/lib/csvExport';
import dayjs from 'dayjs';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#14b8a6', '#f97316'];

export const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const { data, loading, error } = useAnalyticsData(filters);

  // Date picker states
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Apply date filters
  const handleApplyFilters = () => {
    setFilters({
      startDate,
      endDate,
    });
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilters({});
  };

  // Province distribution data
  const provinceData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const province = item.province || 'Unknown';
      counts[province] = (counts[province] || 0) + 1;
    });
    return Object.entries(counts).map(([province, count]) => ({
      province,
      count,
    })).sort((a, b) => b.count - a.count);
  }, [data]);

  // District data for selected province
  const districtData = useMemo(() => {
    if (!selectedProvince) return [];
    const counts: Record<string, number> = {};
    data.filter(item => item.province === selectedProvince).forEach(item => {
      const district = item.district || 'Unknown';
      counts[district] = (counts[district] || 0) + 1;
    });
    return Object.entries(counts).map(([district, count]) => ({
      district,
      count,
    })).sort((a, b) => b.count - a.count);
  }, [data, selectedProvince]);

  // Salary scale distribution
  const salaryData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const scale = item.salaryScale || 'Unknown';
      counts[scale] = (counts[scale] || 0) + 1;
    });
    return Object.entries(counts).map(([scale, count]) => ({
      scale,
      count,
    })).sort((a, b) => b.count - a.count);
  }, [data]);

  // Referral data
  const referralData = useMemo(() => {
    const withReferral = data.filter(item => item.referralCode).length;
    const withoutReferral = data.length - withReferral;
    return [
      { name: 'With Referral', value: withReferral },
      { name: 'Direct', value: withoutReferral },
    ];
  }, [data]);

  // Growth trend data (applications over time)
  const growthData = useMemo(() => {
    const monthlyCounts: Record<string, number> = {};
    data.forEach(item => {
      if (item.createdAt) {
        const date = dayjs(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt);
        const monthKey = date.format('YYYY-MM');
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      }
    });
    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({
        month: dayjs(month).format('MMM YYYY'),
        count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);



  // Export to CSV
  const handleExportCSV = () => {
    const exportData = data.map(item => ({
      'Full Name': item.fullName,
      'Province': item.province,
      'District': item.district,
      'Salary Scale': item.salaryScale,
      'Status': item.status,
      'Referral Code': item.referralCode || 'N/A',
      'Application Date': item.createdAt ? dayjs(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).format('YYYY-MM-DD') : 'N/A',
    }));
    exportToCSV(exportData, `ZUTE_Reports_${dayjs().format('YYYY-MM-DD')}`);
  };

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading reports: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D70F0E] to-[#E5600B] bg-clip-text text-transparent">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive insights and data visualization</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExportCSV} className="bg-gradient-to-r from-[#D70F0E] to-[#E5600B] hover:opacity-90" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-md border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2 text-gray-800">
            <Filter className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold">Filters</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value as 'pending' | 'approved' | 'rejected' }))}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button onClick={handleClearFilters} variant="outline">Clear</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium opacity-90">Total Applications</div>
              <Users className="h-5 w-5 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.length}</div>
            <p className="text-xs opacity-80 mt-1">All submissions</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium opacity-90">Approved</div>
              <CheckCircle className="h-5 w-5 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusData.find(s => s.status === 'Approved')?.count || 0}</div>
            <p className="text-xs opacity-80 mt-1">{data.length > 0 ? Math.round((statusData.find(s => s.status === 'Approved')?.count || 0) / data.length * 100) : 0}% approval rate</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium opacity-90">Pending</div>
              <Clock className="h-5 w-5 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusData.find(s => s.status === 'Pending')?.count || 0}</div>
            <p className="text-xs opacity-80 mt-1">Awaiting review</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium opacity-90">With Referrals</div>
              <UserCheck className="h-5 w-5 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referralData[0].value}</div>
            <p className="text-xs opacity-80 mt-1">{data.length > 0 ? Math.round(referralData[0].value / data.length * 100) : 0}% referred</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Province Distribution */}
        <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Applications by Province</h3>
              </div>
              <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full">Click to drill down</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="w-full overflow-x-auto">
              <ChartContainer
                config={{
                  count: {
                    label: "Applications",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[280px]"
                style={{ minWidth: `${Math.max(400, provinceData.length * 80)}px` }}
              >
                <BarChart data={provinceData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="province" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                  onClick={(data: { province?: string }) => {
                    if (data && data.province) {
                      setSelectedProvince(data.province);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* District Distribution (when province selected) */}
        <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedProvince ? `Districts in ${selectedProvince}` : 'Select a Province'}
              </h3>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {selectedProvince ? (
              <div className="w-full overflow-x-auto">
                <ChartContainer
                  config={{
                    count: {
                      label: "Applications",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[280px]"
                  style={{ minWidth: `${Math.max(400, districtData.length * 80)}px` }}
                >
                  <BarChart data={districtData} margin={{ top: 5, right: 10, left: 0, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="district" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={65} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ChartContainer>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm">Click on a province bar to see district breakdown</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Salary Scale Distribution */}
        <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Salary Scale Distribution</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                count: {
                  label: "Applications",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[280px] w-full"
            >
              <BarChart data={salaryData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="scale" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Referral Source */}
        <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Referral vs Direct Applications</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                withReferral: {
                  label: "With Referral",
                  color: "hsl(var(--chart-4))",
                },
                direct: {
                  label: "Direct",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[280px] w-full"
            >
              <PieChart>
                <Pie
                  data={referralData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={90}
                  innerRadius={0}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {referralData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Application Growth Trend</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                count: {
                  label: "Applications",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[280px] w-full"
            >
              <LineChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};