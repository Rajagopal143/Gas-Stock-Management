import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Delivery from "@/models/Delivery";
import Collection from "@/models/Collection";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB();
    const [customer, deliveries, collections] = await Promise.all([
      Customer.findById(id),
      Delivery.find({ customerId: id }).sort({ deliveryDate: -1 }),
      Collection.find({ customerId: id }).sort({ paymentDate: -1 })
    ]);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const totalSales = deliveries.reduce((sum, d) => sum + (d.quantity * d.pricePerCylinder), 0);
    const totalPaid = collections.reduce((sum, c) => sum + c.amount, 0);

    return NextResponse.json({ 
      customer, 
      deliveries, 
      collections,
      totalSales, 
      totalPaid,
      balance: customer.outstandingAmount || 0,
      lastActivityDate: deliveries[0]?.deliveryDate || collections[0]?.paymentDate || null 
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const customer = await Customer.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(customer);
  } catch {
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    // In a real app, you might want to check for existing deliveries/collections 
    // before allowing delete, or delete them along with the customer.
    // For now, we'll just delete the customer.
    await Customer.findByIdAndDelete(id);
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
