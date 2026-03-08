"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import Link from "next/link";
import { 
  Users, 
  Package, 
  Truck, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  ShoppingCart,
  Wallet,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: summary } = useQuery({ 
    queryKey: ["summary"], 
    queryFn: () => fetch("/api/dashboard/summary").then((r) => r.json()) 
  });
  const { data: profit } = useQuery({ 
    queryKey: ["profit"], 
    queryFn: () => fetch("/api/profit/summary").then((r) => r.json()) 
  });

  const stats = [
    { label: "Total Customers", value: summary?.totalCustomers ?? 0, icon: Users, color: "bg-blue-500", trend: "+2.5%" },
    { label: "Monthly Profit", value: `₹${profit?.monthlyProfit ?? 0}`, icon: TrendingUp, color: "bg-indigo-500", trend: "+12%" },
    { label: "Monthly Collected", value: `₹${profit?.monthlyCollection ?? 0}`, icon: Wallet, color: "bg-emerald-500", trend: "+15%" },
    { label: "Total Outstanding", value: `₹${profit?.totalOutstanding ?? 0}`, icon: AlertCircle, color: "bg-rose-500", trend: "+8%" },
    { label: "Stock in Hand", value: summary?.cylindersInStock ?? 0, icon: Package, color: "bg-amber-500", trend: "-4%" },
  ];

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
    { name: "Revenue", value: profit?.totalRevenue || 0 },
    { name: "Expenses", value: profit?.totalExpense || 0 }
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight">Financial Overview</h2>
        <p className="text-muted-foreground">Real-time performance metrics for Amman Gas Agency.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden group transition-all hover:scale-[1.02]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`flex size-10 items-center justify-center rounded-xl ${stat.color} text-white shadow-lg`}>
                  <stat.icon className="size-5" />
                </div>
                <div className={`flex items-center text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {stat.trend.startsWith('+') ? <ArrowUpRight className="mr-0.5 size-3" /> : <ArrowDownRight className="mr-0.5 size-3" />}
                   {stat.trend}
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Weekly sales distribution over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Revenue vs Expense comparison.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revExp}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} />
                <Tooltip 
                  cursor={{fill: 'var(--primary)', opacity: 0.1}}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 pb-2">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used operations for daily management.</CardDescription>
          </div>
        </div>
        <CardContent className="p-6 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Link href="/dashboard/customers/new">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-4 border-dashed hover:border-primary hover:bg-primary/5 group transition-all">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Plus className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Add Customer</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">New Registration</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/deliveries/new">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-4 border-dashed hover:border-emerald-500 hover:bg-emerald-50 group transition-all">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Truck className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">New Delivery</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Outbound Stock</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/collections/new">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-4 border-dashed hover:border-emerald-600 hover:bg-emerald-50 group transition-all">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <IndianRupee className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Record Collection</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Inbound Cash</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/purchases/new">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-4 border-dashed hover:border-amber-500 hover:bg-amber-50 group transition-all">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ShoppingCart className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Add Purchase</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Restock</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/inventory/new">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-4 border-dashed hover:border-indigo-500 hover:bg-indigo-50 group transition-all">
                <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Package className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Update Stock</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Inventory Sync</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
