import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Delivery from "@/models/Delivery";
import Collection from "@/models/Collection";

export async function GET(req: Request) {
  try {
    await connectDB();
    const q = new URL(req.url).searchParams.get("q");
    const query = q ? { $or: [{ name: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }, { shopName: new RegExp(q, "i") }] } : {};
    const customers = await Customer.find(query).sort({ createdAt: -1 });

    const customerStats = await Promise.all(customers.map(async (c) => {
      const [deliveries, collections] = await Promise.all([
        Delivery.find({ customerId: c._id }),
        Collection.find({ customerId: c._id })
      ]);

      const totalBuy = deliveries.reduce((sum, d) => sum + (d.quantity * d.pricePerCylinder), 0);
      const totalPaid = collections.reduce((sum, col) => sum + col.amount, 0);
      
      return {
        ...c.toObject(),
        balance: totalBuy - totalPaid
      };
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
    const customer = await Customer.create(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
