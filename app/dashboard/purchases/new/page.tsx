"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Save, Building2, Package, IndianRupee } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { toast } from "sonner";

export default function NewPurchasePage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const submit = handleSubmit(async (v: any) => {
    try {
      const res = await fetch("/api/purchases", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...v, 
          quantity: Number(v.quantity), 
          pricePerCylinder: Number(v.pricePerCylinder) 
        }) 
      });
      
      if (!res.ok) throw new Error("Failed to save purchase");

      toast.success("Purchase order recorded");
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["inventory"] });
      router.push("/dashboard/purchases");
    } catch (error) {
      toast.error("Error recording purchase");
    }
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add Purchase Order</h2>
          <p className="text-muted-foreground">Record a new stock purchase from a supplier.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-primary" />
            Purchase Details
          </CardTitle>
          <CardDescription>Enter supplier information and purchase specifics.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="supplier" className="flex items-center gap-1.5"><Building2 className="size-3" /> Supplier Name</Label>
              <Input id="supplier" placeholder="Bharat Petroleum / HP" {...register("supplier", { required: true })} className="bg-background/50" />
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
                <Label htmlFor="quantity">Quantity Purchased</Label>
                <Input id="quantity" type="number" placeholder="0" {...register("quantity", { required: true })} className="bg-background/50" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price" className="flex items-center gap-1.5"><IndianRupee className="size-3" /> Price Per Cylinder (Landing Cost)</Label>
              <Input id="price" type="number" placeholder="0.00" {...register("pricePerCylinder", { required: true })} className="bg-background/50" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-32 shadow-lg shadow-primary/20">
                {isSubmitting ? "Processing..." : <><Save className="mr-2 size-4" /> Save Purchase</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
