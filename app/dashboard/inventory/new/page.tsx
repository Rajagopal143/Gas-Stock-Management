"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackagePlus, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NewInventoryPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const submit = handleSubmit(async (values: any) => {
    try {
      const res = await fetch("/api/inventory", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          ...values, 
          quantity: Number(values.quantity), 
          purchasePrice: Number(values.purchasePrice), 
          sellingPrice: Number(values.sellingPrice) 
        }) 
      });
      
      if (!res.ok) throw new Error("Failed to save inventory");

      toast.success("Stock updated successfully");
      qc.invalidateQueries({ queryKey: ["inventory"] });
      router.push("/dashboard/inventory");
    } catch (error) {
      toast.error("Error updating stock");
    }
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Update Inventory</h2>
          <p className="text-muted-foreground">Add or update cylinder stock levels.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="size-5 text-primary" />
            Stock Details
          </CardTitle>
          <CardDescription>Update 19kg cylinder stock quantities.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity (19kg Cylinders)</Label>
              <Input id="quantity" type="number" placeholder="0" {...register("quantity", { required: true })} className="bg-background/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pPrice">Purchase Price (₹)</Label>
                <Input id="pPrice" type="number" placeholder="0.00" {...register("purchasePrice", { required: true })} className="bg-background/50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sPrice">Selling Price (₹)</Label>
                <Input id="sPrice" type="number" placeholder="0.00" {...register("sellingPrice", { required: true })} className="bg-background/50" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-32">
                {isSubmitting ? "Updating..." : <><Save className="mr-2 size-4" /> Update Stock</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
