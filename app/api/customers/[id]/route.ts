import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Delivery from "@/models/Delivery";
import { customerSchema } from "@/lib/validators";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const customer = await Customer.findById(params.id);
  const deliveries = await Delivery.find({ customerId: params.id }).sort({ deliveryDate: -1 });
  const totalRevenue = deliveries.reduce((sum, d) => sum + d.quantity * d.pricePerCylinder, 0);
  return NextResponse.json({ customer, deliveries, totalRevenue, lastDeliveryDate: deliveries[0]?.deliveryDate || null });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const parsed = customerSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const customer = await Customer.findByIdAndUpdate(params.id, parsed.data, { new: true });
  return NextResponse.json(customer);
}
