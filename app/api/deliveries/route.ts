import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import Customer from "@/models/Customer";
import Inventory from "@/models/Inventory";
import { deliverySchema } from "@/lib/validators";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const filter: Record<string, unknown> = {};
  if (from || to) filter.deliveryDate = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) };
  const records = await Delivery.find(filter).populate("customerId", "name phone shopName").sort({ deliveryDate: -1 });
  return NextResponse.json(records);
}

export async function POST(req: Request) {
  try {
    
    await connectDB();
    const parsed = deliverySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
    const payload = parsed.data;

    const inventory = await Inventory.findOne({});
    if (!inventory || inventory.quantity < payload.quantity) {
      return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
    }

    const record = await Delivery.create({ ...payload, deliveryDate: payload.deliveryDate || new Date() });
    await Inventory.findOneAndUpdate({}, { $inc: { quantity: -payload.quantity } });

    await Customer.findByIdAndUpdate(payload.customerId, {
      $inc: { outstandingAmount: inventory?.sellingPrice * payload.quantity }
    });
  
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error processing delivery:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
