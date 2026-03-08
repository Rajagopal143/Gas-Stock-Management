"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, Save, User, Tag, Calculator } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { toast } from "sonner";
import { useEffect } from "react";

export default function NewDeliveryPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      customerId: "",
      quantity: 1,
      pricePerCylinder: 0,
      discountPerCylinder: 0,
      notes: ""
    }
  });
  
  const { data: customers = [] } = useQuery({ 
    queryKey: ["customers"], 
    queryFn: () => fetch("/api/customers").then((r) => r.json()) 
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => fetch("/api/inventory").then((r) => r.json())
  });

  const quantity = watch("quantity");
  const price = watch("pricePerCylinder");
  const discount = watch("discountPerCylinder");

  useEffect(() => {
    if (inventory.length > 0 && !price) {
      setValue("pricePerCylinder", inventory[0].sellingPrice);
    }
  }, [inventory, price, setValue]);

  const netPrice = Math.max(0, price - (discount || 0));
  const totalAmount = netPrice * (quantity || 0);

  const submit = handleSubmit(async (v: any) => {
    try {
      const res = await fetch("/api/deliveries", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...v, 
          quantity: Number(v.quantity), 
          pricePerCylinder: Number(v.pricePerCylinder),
          discountPerCylinder: Number(v.discountPerCylinder || 0)
        }) 
      });
      
      if (!res.ok) throw new Error("Failed to save delivery");

      toast.success("Delivery created successfully");
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
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
            
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity (19kg cylinders)</Label>
              <Input id="quantity" type="number" placeholder="0" {...register("quantity", { required: true })} className="bg-background/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="flex items-center gap-1.5"><Tag className="size-3" /> Rate (Fixed Price)</Label>
                <Input id="price" type="number" placeholder="0.00" {...register("pricePerCylinder", { required: true })} className="bg-background/50" />
                <p className="text-[10px] text-muted-foreground italic pl-1">Selling price from inventory.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount" className="flex items-center gap-1.5"><Calculator className="size-3" /> Discount per Cylinder</Label>
                <Input id="discount" type="number" placeholder="0.00" {...register("discountPerCylinder")} className="bg-background/50 text-rose-500 font-bold" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Net Rate Selection:</span>
                <span className="font-bold">₹{netPrice.toLocaleString()} / cyl</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-primary/20">
                <span className="font-medium">Total Billable Amount:</span>
                <span className="text-xl font-black text-primary">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Any specific instructions..." {...register("notes")} className="bg-background/50" />
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
