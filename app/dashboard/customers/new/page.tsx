"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NewCustomerPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

    const submit = handleSubmit(async (values) => {
      console.log(values);
    try {
      const res = await fetch("/api/customers", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(values) 
      });
      if (!res.ok) throw new Error("Failed to save customer");
      
      toast.success("Customer added successfully");
      qc.invalidateQueries({ queryKey: ["customers"] });
      router.push("/dashboard/customers");
    } catch {
      toast.error("Error saving customer");
    }
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Customer</h2>
          <p className="text-muted-foreground">Register a new customer to the system.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            Customer Information
          </CardTitle>
          <CardDescription>Enter the details of the new customer below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name", { required: true })} className="bg-background/50" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+91 00000 00000" {...register("phone", { required: true })} className="bg-background/50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shop">Shop Name</Label>
                <Input id="shop" placeholder="Doe Enterprises" {...register("shopName")} className="bg-background/50" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Street, Area" {...register("address")} className="bg-background/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area">Area / Locality</Label>
                <Input id="area" placeholder="Downtown" {...register("area")} className="bg-background/50" />
              </div>
                          <div className="grid gap-2">
                              <Label htmlFor="outstandingAmount">Opening Outstanding (Optional)</Label>
                              <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-bold">₹</span>
                                  <Input
                                      id="outstandingAmount"
                                      type="number"
                                      placeholder="0"
                                      {...register("outstandingAmount", { valueAsNumber: true })}
                                      className="pl-7 bg-background/50"
                                  />                              </div>
                              <p className="text-[10px] text-muted-foreground italic">Opening debt outstanding if any.</p>
                          </div>
                      </div>

                      <div className="grid gap-2">
                          <Label htmlFor="notes">Reference / Notes</Label>
                          <Input id="notes" placeholder="Referred by..." {...register("notes")} className="bg-background/50" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-32">
                {isSubmitting ? "Saving..." : <><Save className="mr-2 size-4" /> Save Customer</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
