import React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Paginator } from "@/components/ui/pagination"
import { Table } from "@/components/ui/table"

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-4 gap-4">
          <Card><CardHeader>Users</CardHeader><CardContent>-- KPI --</CardContent></Card>
          <Card><CardHeader>Revenue</CardHeader><CardContent>-- KPI --</CardContent></Card>
          <Card><CardHeader>Active Sessions</CardHeader><CardContent>-- KPI --</CardContent></Card>
        </div>

        <Card>
          <CardHeader>User Growth Trend</CardHeader>
          <CardContent>
            {/* <ChartContainer>line chart</ChartContainer> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Recent Activity</CardHeader>
          <CardContent>
            <Table>{/* rows */}</Table>
            <Paginator />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}