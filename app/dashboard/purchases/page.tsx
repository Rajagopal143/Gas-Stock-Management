"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Calendar, Building2, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function PurchasesPage() {
  const { data: purchases = [], isLoading } = useQuery({ 
    queryKey: ["purchases"], 
    queryFn: () => fetch("/api/purchases").then((r) => r.json()) 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
          <p className="text-muted-foreground">Track your inbound stock and procurement costs.</p>
        </div>
        <Link href="/dashboard/purchases/new">
          <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
            <ShoppingCart className="mr-2 size-4" /> Add Purchase
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))
        ) : purchases.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-3xl">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-muted mb-4">
              <ShoppingCart className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No purchase records</h3>
            <p className="text-muted-foreground">Record your first stock purchase to track inventory costs.</p>
          </div>
        ) : (
          purchases.map((p: any) => (
            <Card key={p._id} className="overflow-hidden border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm group transition-all hover:shadow-primary/10">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex items-center gap-4 p-4 md:flex-1">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground truncate">{p.supplier}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center"><Package className="mr-1 size-3" /> {p.quantity} × 19kg cylinders</span>
                        <span className="flex items-center"><Calendar className="mr-1 size-3" /> {p.date ? format(new Date(p.date), "dd MMM yyyy") : "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-8 bg-muted/30 p-4 md:bg-transparent md:px-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Unit Cost</p>
                      <p className="font-bold text-foreground/80">₹{p.pricePerCylinder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Bill</p>
                      <p className="text-2xl font-black tracking-tight text-primary">₹{p.totalCost}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
