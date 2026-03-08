"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User, IndianRupee, Wallet, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewCollectionPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();
  
  const { data: customers = [] } = useQuery({ 
    queryKey: ["customers"], 
    queryFn: () => fetch("/api/customers").then((r) => r.json()) 
  });

  const selectedCustomerId = watch("customerId");
  const selectedCustomer = customers.find((c: any) => c._id === selectedCustomerId);

  const submit = handleSubmit(async (v: any) => {
    try {
      const res = await fetch("/api/collections", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...v, 
          amount: Number(v.amount)
        }) 
      });
      
      if (!res.ok) throw new Error("Failed to record payment");

      toast.success("Payment recorded successfully");
      qc.invalidateQueries({ queryKey: ["collections"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      qc.invalidateQueries({ queryKey: ["profit"] });
      qc.invalidateQueries({ queryKey: ["customers"] });
      router.push("/dashboard/collections");
    } catch {
      toast.error("Error recording payment");
    }
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Record Collection</h2>
          <p className="text-muted-foreground">Log a payment received from a customer during daily routine.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-5 text-primary" />
            Payment Details
          </CardTitle>
          <CardDescription>Select customer and enter the collected amount.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="customer" className="flex items-center gap-1.5 font-bold"><User className="size-3" /> Customer</Label>
              <NativeSelect id="customer" {...register("customerId", { required: true })} className="bg-background/50 h-11">
                <option value="">Select a customer</option>
                {customers.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.shopName || "Personal"})</option>
                ))}
              </NativeSelect>

              {selectedCustomer && (
                <div className={cn(
                  "mt-2 p-3 rounded-xl flex items-center justify-between border",
                  selectedCustomer.balance > 0 ? "bg-rose-50 border-rose-100 text-rose-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"
                )}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Current Outstanding</span>
                  </div>
                  <span className="text-lg font-black tracking-tight">₹{selectedCustomer.balance.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount" className="flex items-center gap-1.5 font-bold"><IndianRupee className="size-3" /> Amount Collected</Label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</div>
                   <Input id="amount" type="number" placeholder="0.00" {...register("amount", { required: true })} className="bg-background/50 h-11 pl-7 text-lg font-bold" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mode" className="font-bold">Payment Mode</Label>
                <NativeSelect id="mode" {...register("paymentMode", { required: true })} className="bg-background/50 h-11">
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / PhonePe / GPay</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </NativeSelect>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes" className="font-bold">Short Note (Optional)</Label>
              <Input id="notes" placeholder="e.g. Cleared bill #104" {...register("notes")} className="bg-background/50 h-11" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" className="h-11 px-6" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-40 h-11 shadow-lg shadow-primary/20 bg-primary font-bold">
                {isSubmitting ? "Recording..." : <><Save className="mr-2 size-4" /> Save Collection</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-700">
         <p className="flex gap-2">
           <span className="font-bold underline">Tip:</span> 
          Recording collections daily helps in tracking customer outstanding and accurate cash-in-hand reports.
         </p>
      </div>
    </div>
  );
}
