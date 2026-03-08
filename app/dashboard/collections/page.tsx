"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Calendar, User, Search, Plus, Filter, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CollectionsPage() {
  const [search, setSearch] = useState("");
  const { data: collections = [], isLoading } = useQuery({ 
    queryKey: ["collections"], 
    queryFn: () => fetch("/api/collections").then((r) => r.json()) 
  });

  const filtered = collections.filter((c: any) => 
    c.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.paymentMode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Collections</h2>
          <p className="text-muted-foreground text-sm">Track income and payments received from customers.</p>
        </div>
        <Link href="/dashboard/collections/new">
          <Button className="w-full md:w-auto shadow-lg shadow-primary/20 gap-2">
            <Plus className="size-4" /> Record Payment
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by customer or payment mode..." 
            className="pl-9 bg-background/50" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0 border-dashed">
          <Filter className="size-4" />
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed rounded-3xl">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-muted mb-4 text-muted-foreground">
                  <IndianRupee className="size-6" />
                </div>
                <h3 className="text-lg font-medium">No collections found</h3>
                <p className="text-muted-foreground">Start by recording a payment from a customer.</p>
              </div>
            ) : (
              filtered.map((c: any) => (
                <div 
                  key={c._id} 
                  className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
                      <IndianRupee className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground truncate">{c.customerId?.name}</h4>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px] py-0 px-2 h-5">
                          {c.paymentMode}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center"><Calendar className="mr-1 size-3" /> {format(new Date(c.paymentDate), "dd MMM yyyy, p")}</span>
                        {c.notes && <span className="flex items-center italic truncate max-w-[200px]">{c.notes}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t pt-4 md:border-none md:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Amount Received</p>
                      <p className="text-2xl font-black tracking-tight text-emerald-600">₹{c.amount.toLocaleString()}</p>
                    </div>
                    <div className="hidden md:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <CheckCircle2 className="size-4 text-emerald-500" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
