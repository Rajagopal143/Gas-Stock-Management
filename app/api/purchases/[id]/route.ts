import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PurchaseOrder from "@/models/PurchaseOrder";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await PurchaseOrder.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
