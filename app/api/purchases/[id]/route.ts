import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PurchaseOrder from "@/models/PurchaseOrder";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await PurchaseOrder.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
