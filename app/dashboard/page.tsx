"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import Link from "next/link";

export default function DashboardPage() {
  const { data } = useQuery({ queryKey: ["summary"], queryFn: () => fetch("/api/dashboard/summary").then((r) => r.json()) });
  const profit = useQuery({ queryKey: ["profit"], queryFn: () => fetch("/api/profit/summary").then((r) => r.json()) });

  const weeklyData = [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 15000 },
    { day: "Wed", sales: 17000 },
    { day: "Thu", sales: 13000 },
    { day: "Fri", sales: 19000 },
    { day: "Sat", sales: 22000 },
    { day: "Sun", sales: 18000 }
  ];

  const revExp = [
    { name: "Revenue", value: profit.data?.totalRevenue || 0 },
    { name: "Expense", value: profit.data?.totalExpense || 0 }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Card>Total Customers: {data?.totalCustomers ?? 0}</Card>
        <Card>Cylinders in Stock: {data?.cylindersInStock ?? 0}</Card>
        <Card>Deliveries Today: {data?.deliveriesToday ?? 0}</Card>
        <Card>Today Revenue: ₹{data?.todaysRevenue ?? 0}</Card>
        <Card>Monthly Profit: ₹{data?.monthlyProfit ?? 0}</Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-72"><h3 className="mb-2 font-semibold">Weekly Sales</h3><ResponsiveContainer width="100%" height="85%"><LineChart data={weeklyData}><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="sales" stroke="#2563eb" /></LineChart></ResponsiveContainer></Card>
        <Card className="h-72"><h3 className="mb-2 font-semibold">Revenue vs Expense</h3><ResponsiveContainer width="100%" height="85%"><BarChart data={revExp}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#16a34a" /></BarChart></ResponsiveContainer></Card>
      </div>
      <Card>
        <h3 className="mb-2 font-semibold">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded bg-primary px-3 py-2 text-white" href="/dashboard/customers">Add Customer</Link>
          <Link className="rounded bg-primary px-3 py-2 text-white" href="/dashboard/deliveries">New Delivery</Link>
          <Link className="rounded bg-primary px-3 py-2 text-white" href="/dashboard/purchases">Add Purchase</Link>
          <Link className="rounded bg-primary px-3 py-2 text-white" href="/dashboard/inventory">Add Stock</Link>
        </div>
      </Card>
    </div>
  );
}
