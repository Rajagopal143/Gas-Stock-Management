"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InventoryPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { data = [] } = useQuery({ queryKey: ["inventory"], queryFn: () => fetch("/api/inventory").then((r) => r.json()) });
  const submit = handleSubmit(async (values: any) => {
    await fetch("/api/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, quantity: Number(values.quantity), purchasePrice: Number(values.purchasePrice), sellingPrice: Number(values.sellingPrice) }) });
    reset();
    qc.invalidateQueries({ queryKey: ["inventory"] });
  });

  return <div className="grid gap-4 md:grid-cols-2"><Card><h2 className="mb-2 font-semibold">Add / Update Stock</h2><form className="space-y-2" onSubmit={submit}><select className="w-full rounded border p-2" {...register("cylinderType")}><option>14.2kg Domestic</option><option>19kg Commercial</option></select><Input placeholder="Quantity" type="number" {...register("quantity")} /><Input placeholder="Purchase Price" type="number" {...register("purchasePrice")} /><Input placeholder="Selling Price" type="number" {...register("sellingPrice")} /><Button type="submit">Save</Button></form></Card><Card><h2 className="mb-2 font-semibold">Current Stock</h2>{data.map((i: any) => <div key={i._id} className={`mb-2 rounded border p-2 ${i.quantity < 10 ? "border-red-400 bg-red-50" : ""}`}>{i.cylinderType}: {i.quantity} cylinders {i.quantity < 10 && <span className="text-red-500">(Low stock)</span>}</div>)}</Card></div>;
}
