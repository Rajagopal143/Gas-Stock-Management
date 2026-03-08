import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileText, 
  BarChart3, 
  Users, 
  Package, 
  Download, 
  ExternalLink,
  Calendar,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const reports = [
    { title: "Daily Sales Report", description: "Summary of all sales and transactions for today.", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Monthly Performance", description: "Comprehensive view of business performance this month.", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Customer Ledger", description: "Detailed transaction history for all customers.", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Inventory Aging", description: "Analysis of stock turnover and aging cylinders.", icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Profit & Loss Statement", description: "Net income and loss breakdown for tax purposes.", icon: Layers, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "System Audit Logs", description: "History of all user actions and system changes.", icon: FileText, color: "text-slate-500", bg: "bg-slate-500/10" },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight">Analytical Reports</h2>
        <p className="text-muted-foreground">Download and analyze business data from various perspectives.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, i) => (
          <Card key={i} className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm group transition-all hover:scale-[1.02] hover:shadow-primary/10">
            <CardHeader className="pb-2">
              <div className={`flex size-12 items-center justify-center rounded-2xl ${report.bg} ${report.color} mb-2`}>
                <report.icon className="size-6" />
              </div>
              <CardTitle className="text-xl font-bold">{report.title}</CardTitle>
              <CardDescription className="line-clamp-2 md:h-10">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5 border-dashed">
                  <ExternalLink className="size-3" /> View
                </Button>
                <Button size="sm" className="flex-1 text-xs gap-1.5" asChild>
                  <a href="/api/reports/csv">
                    <Download className="size-3" /> CSV
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-primary/5 border border-primary/10 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-white shadow-2xl shadow-primary/40">
              <Download className="size-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tight">Export Full Database</h3>
              <p className="text-muted-foreground mt-2">Generate a complete backup of all system data including customers, inventory, and transaction history.</p>
            </div>
            <Button size="lg" className="min-w-[200px] shadow-xl shadow-primary/20">
              Generate Full Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
