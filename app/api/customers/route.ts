import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET(req: Request) {
  try {
    await connectDB();
    const q = new URL(req.url).searchParams.get("q");
    const query = q ? { $or: [{ name: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }, { shopName: new RegExp(q, "i") }] } : {};
    const customers = await Customer.find(query).sort({ createdAt: -1 });

    const customerStats = customers.map((c: { toObject: () => any; outstandingAmount?: number }) => ({
      ...c.toObject(),
      balance: c.outstandingAmount || 0
    }));

    return NextResponse.json(customerStats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log(Customer.schema.paths); 
    console.log(body);
    const customer = await Customer.create({
      ...body,
      
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
