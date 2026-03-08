import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import { inventorySchema } from "@/lib/validators";

export async function GET() {
  await connectDB();
  const items = await Inventory.find({}).sort({ cylinderType: 1 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await connectDB();
  const parsed = inventorySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const item = await Inventory.findOneAndUpdate(
    { cylinderType: parsed.data.cylinderType },
    parsed.data,
    { upsert: true, new: true }
  );
  return NextResponse.json(item, { status: 201 });
}
