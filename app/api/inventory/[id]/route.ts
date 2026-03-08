import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import { inventorySchema } from "@/lib/validators";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const parsed = inventorySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const item = await Inventory.findByIdAndUpdate(params.id, parsed.data, { new: true });
  return NextResponse.json(item);
}
