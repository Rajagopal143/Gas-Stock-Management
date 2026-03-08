"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading } = useQuery({ 
    queryKey: ["customers"], 
    queryFn: () => fetch("/api/customers").then((r) => r.json()) 
  });

  const filteredCustomers = customers.filter((c: { name: string; shopName?: string; phone: string }) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage and view your distribution network.</p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
            <UserPlus className="mr-2 size-4" /> Add New Customer
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Customer Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-9 bg-background/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
              ))
            ) : filteredCustomers.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-muted mb-4">
                  <UserPlus className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No customers found</h3>
                <p className="text-muted-foreground">Try adjusting your search or add a new customer.</p>
              </div>
            ) : (
              filteredCustomers.map((c: any) => (
                <div 
                  key={c._id} 
                  className="group relative flex flex-col justify-between rounded-2xl border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
                        <span className="font-black text-lg">{c.name.charAt(0)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Balance</p>
                        <p className={cn(
                          "text-lg font-black tracking-tighter",
                          c.balance > 0 ? "text-rose-500" : "text-emerald-500"
                        )}>
                          ₹{c.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">{c.name}</h4>
                      <p className="flex items-center text-xs text-muted-foreground mt-1">
                        <Store className="mr-1.5 size-3" /> {c.shopName || "Personal Account"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-dashed">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold uppercase text-muted-foreground">Phone</p>
                         <p className="text-xs font-medium truncate">{c.phone}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold uppercase text-muted-foreground">Area</p>
                         <p className="text-xs font-medium truncate">{c.area || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/dashboard/customers/${c._id}`} className="absolute inset-0 z-0">
                    <span className="sr-only">View customer details</span>
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
