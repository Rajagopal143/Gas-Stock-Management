import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const delivery = await Delivery.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(delivery);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Delivery.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
