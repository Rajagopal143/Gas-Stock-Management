"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, UserPlus, Save, UserCog } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditCustomerPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetch(`/api/customers/${id}`).then((res) => res.json()),
  });

  useEffect(() => {
    if (data?.customer) {
      reset(data.customer);
    }
  }, [data, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      const res = await fetch(`/api/customers/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(values) 
      });
      if (!res.ok) throw new Error();
      
      toast.success("Customer updated successfully");
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customer", id] });
      router.push(`/dashboard/customers/${id}`);
    } catch {
      toast.error("Error updating customer");
    }
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Customer</h2>
          <p className="text-muted-foreground">Modify customer details and settings.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="size-5 text-primary" />
            Customer Information
          </CardTitle>
          <CardDescription>Update the details of the customer below.</CardDescription>
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
                <Label htmlFor="notes">Reference / Notes</Label>
                <Input id="notes" placeholder="Referred by..." {...register("notes")} className="bg-background/50" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-32">
                {isSubmitting ? "Updating..." : <><Save className="mr-2 size-4" /> Save Changes</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
