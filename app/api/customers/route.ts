import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Delivery from "@/models/Delivery";
import { customerSchema } from "@/lib/validators";

export async function GET(req: Request) {
  await connectDB();
  const q = new URL(req.url).searchParams.get("q");
  const query = q ? { $or: [{ name: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }, { shopName: new RegExp(q, "i") }] } : {};
  const customers = await Customer.find(query).sort({ createdAt: -1 });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  await connectDB();
  const parsed = customerSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const customer = await Customer.create(parsed.data);
  return NextResponse.json(customer, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectDB();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  await Delivery.deleteMany({ customerId: id });
  await Customer.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
