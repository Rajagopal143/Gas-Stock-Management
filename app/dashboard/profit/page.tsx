"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Wallet, ArrowUpRight, IndianRupee, PieChart, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfitPage() {
  const { data, isLoading } = useQuery({ 
    queryKey: ["profit"], 
    queryFn: () => fetch("/api/profit/summary").then((r) => r.json()) 
  });

  const chartData = [
    { name: "Revenue", amount: data?.totalRevenue || 0, color: "var(--primary)" },
    { name: "Expense", amount: data?.totalExpense || 0, color: "#64748b" },
    { name: "Collected", amount: data?.totalCollected || 0, color: "#10b981" }
  ];

  const profitStats = [
    { label: "Weekly Profit", value: data?.weeklyProfit ?? 0, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Monthly Profit", value: data?.monthlyProfit ?? 0, icon: PieChart, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Yearly Profit", value: data?.yearlyProfit ?? 0, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  const collectionStats = [
    { label: "Weekly Collection", value: data?.weeklyCollection ?? 0, icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Monthly Collection", value: data?.monthlyCollection ?? 0, icon: CalendarCheck, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Yearly Collection", value: data?.yearlyCollection ?? 0, icon: IndianRupee, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-foreground">Financial Performance</h2>
        <p className="text-muted-foreground">Comprehensive tracking of profit, collections, and expenditures.</p>
      </div>

      <Tabs defaultValue="profit" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="profit" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Net Profit</TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Cash Collections</TabsTrigger>
          </TabsList>
          <Badge variant="outline" className="font-bold text-emerald-600 bg-emerald-50 border-emerald-100">
            Live Updates
          </Badge>
        </div>

        <TabsContent value="profit" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {profitStats.map((item, i) => (
              <Card key={i} className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm transition-all hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex size-12 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                      <item.icon className="size-6" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <h3 className="text-3xl font-black tracking-tighter text-foreground">₹{item.value.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {collectionStats.map((item, i) => (
              <Card key={i} className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm transition-all hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex size-12 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                      <item.icon className="size-6" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <h3 className="text-3xl font-black tracking-tighter text-foreground">₹{item.value.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3 border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Overall Cash Flow</CardTitle>
            <CardDescription>Comparison of Sales Revenue, Procurement Expenses, and Actual Collections.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} />
                <Tooltip 
                  cursor={{fill: 'var(--primary)', opacity: 0.05}}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={80}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Business Summary</CardTitle>
            <CardDescription>Key financial data points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</p>
                  <p className="text-lg font-black text-primary">₹{data?.totalRevenue?.toLocaleString() ?? 0}</p>
                </div>
                <TrendingUp className="size-5 text-primary opacity-50" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 transition-colors hover:bg-emerald-50">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Collected</p>
                  <p className="text-lg font-black text-emerald-600">₹{data?.totalCollected?.toLocaleString() ?? 0}</p>
                </div>
                <Wallet className="size-5 text-emerald-500 opacity-50" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-200 transition-colors hover:bg-slate-50">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Outstanding</p>
                  <p className="text-lg font-black text-slate-700">₹{((data?.totalRevenue ?? 0) - (data?.totalCollected ?? 0)).toLocaleString()}</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100 font-bold">Outstanding</Badge>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl border border-dashed border-primary/20 bg-primary/[0.02]">
              <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                Revenue is calculated based on Deliveries, while Collected shows the actual cash received. Ensure all daily collections are logged for accurate reporting.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
