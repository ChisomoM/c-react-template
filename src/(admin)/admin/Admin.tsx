import React from "react";
// import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Paginator } from "@/components/ui/pagination";
// import { Toaster } from "@/components/ui/sonner";
// import { ChartContainer } from "@/components/ui/chart";
import { Table } from "@/components/ui/table";

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-4 gap-4">
          <Card><CardHeader>Transactions</CardHeader><CardContent>-- KPI --</CardContent></Card>
          <Card><CardHeader>Verifications</CardHeader><CardContent>-- KPI --</CardContent></Card>

          <Card><CardHeader>Active Customers</CardHeader><CardContent>-- KPI --</CardContent></Card>
        </div>

        <Card>
          <CardHeader>Transactions Trend</CardHeader>
          <CardContent>
            {/* <ChartContainer>line chart</ChartContainer> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Recent Transactions</CardHeader>
          <CardContent>
            <Table>{/* rows */}</Table>
            <Paginator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};