import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PurchaseOrder from "@/models/PurchaseOrder";
import Inventory from "@/models/Inventory";
import { purchaseSchema } from "@/lib/validators";

export async function GET() {
  await connectDB();
  const records = await PurchaseOrder.find({}).sort({ purchaseDate: -1 });
  return NextResponse.json(records);
}

export async function POST(req: Request) {
  await connectDB();
  const parsed = purchaseSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const payload = parsed.data;
  const totalCost = payload.quantity * payload.pricePerCylinder;
  const record = await PurchaseOrder.create({ ...payload, totalCost, purchaseDate: payload.purchaseDate || new Date() });
  await Inventory.findOneAndUpdate(
    { cylinderType: payload.cylinderType },
    { $inc: { quantity: payload.quantity }, $set: { purchasePrice: payload.pricePerCylinder } },
    { upsert: true, new: true }
  );
  return NextResponse.json(record, { status: 201 });
}
