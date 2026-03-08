import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();

  const delivery = await Delivery.findByIdAndUpdate(id, body, { new: true });
  if (!delivery) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(delivery);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Delivery.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
