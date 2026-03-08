"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackagePlus, AlertTriangle, CheckCircle2, Package, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function InventoryPage() {
  const { data = [], isLoading } = useQuery({ 
    queryKey: ["inventory"], 
    queryFn: () => fetch("/api/inventory").then((r) => r.json()) 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Monitor and manage your cylinder stock levels.</p>
        </div>
        <Link href="/dashboard/inventory/new">
          <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
            <PackagePlus className="mr-2 size-4" /> Update Stock
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))
        ) : (
          data.map((i: any) => {
            const isLowStock = i.quantity < 10;
            return (
              <Card key={i._id} className="relative overflow-hidden border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm group transition-all hover:shadow-primary/10">
                <div className={`absolute top-0 left-0 w-1 h-full ${isLowStock ? "bg-destructive" : "bg-primary"}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="size-5" />
                    </div>
                    <Badge variant={isLowStock ? "destructive" : "secondary"} className="font-semibold uppercase tracking-wider text-[10px]">
                      {isLowStock ? <><AlertTriangle className="mr-1 size-3" /> Low Stock</> : <><CheckCircle2 className="mr-1 size-3" /> In Stock</>}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-lg">{i.cylinderType}</CardTitle>
                  <CardDescription>Current balance in warehouse</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter">{i.quantity}</span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Units</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Buy Price</p>
                      <p className="flex items-center text-sm font-semibold text-foreground/70">
                        <TrendingDown className="mr-1.5 size-3 text-destructive" /> ₹{i.purchasePrice}
                      </p>
                    </div>
                    <div className="space-y-1 border-l pl-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sell Price</p>
                      <p className="flex items-center text-sm font-semibold text-foreground/70">
                        <TrendingUp className="mr-1.5 size-3 text-primary" /> ₹{i.sellingPrice}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
