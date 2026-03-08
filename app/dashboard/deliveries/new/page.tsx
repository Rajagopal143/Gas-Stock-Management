"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, Save, User, Package, IndianRupee } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { toast } from "sonner";

export default function NewDeliveryPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  
  const { data: customers = [] } = useQuery({ 
    queryKey: ["customers"], 
    queryFn: () => fetch("/api/customers").then((r) => r.json()) 
  });

  const submit = handleSubmit(async (v: any) => {
    try {
      const res = await fetch("/api/deliveries", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...v, 
          quantity: Number(v.quantity), 
          pricePerCylinder: Number(v.pricePerCylinder) 
        }) 
      });
      
      if (!res.ok) throw new Error("Failed to save delivery");

      toast.success("Delivery created successfully");
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      qc.invalidateQueries({ queryKey: ["inventory"] });
      router.push("/dashboard/deliveries");
    } catch {
      toast.error("Error creating delivery");
    }
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Delivery</h2>
          <p className="text-muted-foreground">Register a new cylinder delivery to a customer.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5 text-primary" />
            Delivery Details
          </CardTitle>
          <CardDescription>Select customer and specify delivery particulars.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="customer" className="flex items-center gap-1.5"><User className="size-3" /> Customer</Label>
              <NativeSelect id="customer" {...register("customerId", { required: true })} className="bg-background/50">
                <option value="">Select a customer</option>
                {customers.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.shopName || "Personal"})</option>
                ))}
              </NativeSelect>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type" className="flex items-center gap-1.5"><Package className="size-3" /> Cylinder Type</Label>
                <NativeSelect id="type" {...register("cylinderType", { required: true })} className="bg-background/50">
                  <option value="14.2kg Domestic">14.2kg Domestic</option>
                  <option value="19kg Commercial">19kg Commercial</option>
                  <option value="5kg Mini">5kg Mini</option>
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="0" {...register("quantity", { required: true })} className="bg-background/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="flex items-center gap-1.5"><IndianRupee className="size-3" /> Price Per Cylinder</Label>
                <Input id="price" type="number" placeholder="0.00" {...register("pricePerCylinder", { required: true })} className="bg-background/50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Any specific instructions..." {...register("notes")} className="bg-background/50" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-32 shadow-lg shadow-primary/20">
                {isSubmitting ? "Saving..." : <><Save className="mr-2 size-4" /> Save Delivery</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
