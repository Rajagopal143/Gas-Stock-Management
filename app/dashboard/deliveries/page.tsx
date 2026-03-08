"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Calendar, Package, IndianRupee, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DeliveriesPage() {
  const { data: deliveries = [], isLoading } = useQuery({ 
    queryKey: ["deliveries"], 
    queryFn: () => fetch("/api/deliveries").then((r) => r.json()) 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deliveries</h2>
          <p className="text-muted-foreground">Detailed history of all cylinder deliveries.</p>
        </div>
        <Link href="/dashboard/deliveries/new">
          <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
            <Truck className="mr-2 size-4" /> New Delivery
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Delivery Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))
            ) : deliveries.length === 0 ? (
              <div className="py-20 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-muted mb-4">
                  <Truck className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No deliveries yet</h3>
                <p className="text-muted-foreground">Start by creating your first cylinder delivery.</p>
              </div>
            ) : (
              deliveries.map((d: any) => (
                <div 
                  key={d._id} 
                  className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Truck className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground truncate">{d.customerId?.name}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center"><Package className="mr-1 size-3" /> {d.quantity} × 19kg cylinders</span>
                        <span className="flex items-center font-semibold text-primary/80"><IndianRupee className="mr-1 size-3" />₹{d.quantity * d.pricePerCylinder}</span>
                        <span className="flex items-center"><Calendar className="mr-1 size-3" /> {format(new Date(d.createdAt), "dd MMM yyyy, p")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-3 border-t pt-4 md:border-none md:pt-0">
                    <div className="flex flex-col text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-black tracking-tight text-primary">₹{(d.quantity * (d.pricePerCylinder - (d.discountPerCylinder || 0))).toLocaleString()}</p>
                    </div>

                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>

                  <Link href={`/dashboard/deliveries/${d._id}`} className="absolute inset-0 z-0">
                    <span className="sr-only">View delivery details</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
