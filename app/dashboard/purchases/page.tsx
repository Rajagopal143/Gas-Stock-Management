"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PurchasesPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { data = [] } = useQuery({ queryKey: ["purchases"], queryFn: () => fetch("/api/purchases").then((r) => r.json()) });
  const submit = handleSubmit(async (v: any) => {
    await fetch("/api/purchases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, quantity: Number(v.quantity), pricePerCylinder: Number(v.pricePerCylinder) }) });
    reset();
    qc.invalidateQueries({ queryKey: ["purchases"] });
    qc.invalidateQueries({ queryKey: ["inventory"] });
  });

  return <div className="grid gap-4 md:grid-cols-2"><Card><h2 className="mb-2 font-semibold">Add Purchase</h2><form className="space-y-2" onSubmit={submit}><Input placeholder="Supplier Name" {...register("supplier")} /><select className="w-full rounded border p-2" {...register("cylinderType")}><option>14.2kg Domestic</option><option>19kg Commercial</option></select><Input type="number" placeholder="Quantity" {...register("quantity")} /><Input type="number" placeholder="Price per Cylinder" {...register("pricePerCylinder")} /><Button type="submit">Add Purchase</Button></form></Card><Card><h2 className="mb-2 font-semibold">Purchase Orders</h2>{data.map((p: any) => <div key={p._id} className="mb-2 rounded border p-2">{p.supplier} • {p.cylinderType} • {p.quantity} • ₹{p.totalCost}</div>)}</Card></div>;
}
