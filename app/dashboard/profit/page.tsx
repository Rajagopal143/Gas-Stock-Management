"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function ProfitPage() {
  const { data } = useQuery({ queryKey: ["profit"], queryFn: () => fetch("/api/profit/summary").then((r) => r.json()) });
  const chart = [
    { name: "Revenue", amount: data?.totalRevenue || 0 },
    { name: "Expense", amount: data?.totalExpense || 0 }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>Daily Profit: ₹{data?.dailyProfit ?? 0}</Card>
        <Card>Weekly Profit: ₹{data?.weeklyProfit ?? 0}</Card>
        <Card>Monthly Profit: ₹{data?.monthlyProfit ?? 0}</Card>
      </div>
      <Card className="h-80">
        <h3 className="mb-2 font-semibold">Revenue vs Expense</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chart}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
