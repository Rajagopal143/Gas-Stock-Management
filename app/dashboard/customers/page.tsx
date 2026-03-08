"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CustomersPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: () => fetch("/api/customers").then((r) => r.json()) });

  const submit = handleSubmit(async (values) => {
    await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    reset();
    qc.invalidateQueries({ queryKey: ["customers"] });
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="mb-3 font-semibold">Add Customer</h2>
        <form className="space-y-2" onSubmit={submit}>
          <Input placeholder="Customer Name" {...register("name")} />
          <Input placeholder="Phone Number" {...register("phone")} />
          <Input placeholder="Shop Name" {...register("shopName")} />
          <Input placeholder="Address" {...register("address")} />
          <Input placeholder="Area" {...register("area")} />
          <Input placeholder="Notes" {...register("notes")} />
          <Button type="submit">Save</Button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">Customers</h2>
        <div className="space-y-2">
          {customers.map((c: any) => (
            <div key={c._id} className="rounded border p-2">
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.phone} • {c.shopName}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
