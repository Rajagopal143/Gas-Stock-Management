"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DeliveriesPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: () => fetch("/api/customers").then((r) => r.json()) });
  const { data = [] } = useQuery({ queryKey: ["deliveries"], queryFn: () => fetch("/api/deliveries").then((r) => r.json()) });
  const submit = handleSubmit(async (v: any) => {
    await fetch("/api/deliveries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, quantity: Number(v.quantity), pricePerCylinder: Number(v.pricePerCylinder) }) });
    reset();
    qc.invalidateQueries({ queryKey: ["deliveries"] });
    qc.invalidateQueries({ queryKey: ["inventory"] });
  });

  return <div className="grid gap-4 md:grid-cols-2"><Card><h2 className="mb-2 font-semibold">Create Delivery</h2><form className="space-y-2" onSubmit={submit}><select className="w-full rounded border p-2" {...register("customerId")}>{customers.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}</select><select className="w-full rounded border p-2" {...register("cylinderType")}><option>14.2kg Domestic</option><option>19kg Commercial</option></select><Input type="number" placeholder="Quantity" {...register("quantity")} /><Input type="number" placeholder="Price per Cylinder" {...register("pricePerCylinder")} /><Input placeholder="Notes" {...register("notes")} /><Button type="submit">Save Delivery</Button></form></Card><Card><h2 className="mb-2 font-semibold">Deliveries</h2>{data.map((d: any) => <div key={d._id} className="mb-2 rounded border p-2">{d.customerId?.name} • {d.cylinderType} • {d.quantity} • ₹{d.quantity * d.pricePerCylinder} • {d.status}</div>)}</Card></div>;
}
