import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";

export async function GET() {
  await connectDB();
  const deliveries = await Delivery.find({}).populate("customerId", "name").sort({ deliveryDate: -1 });
  const rows = ["Date,Customer,Cylinder Type,Quantity,Price,Amount,Status"];
  deliveries.forEach((d) => {
    const amount = d.quantity * d.pricePerCylinder;
    rows.push(`${new Date(d.deliveryDate).toISOString().slice(0,10)},${d.customerId?.name || ""},${d.cylinderType},${d.quantity},${d.pricePerCylinder},${amount},${d.status}`);
  });
  const csv = rows.join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=deliveries-report.csv"
    }
  });
}
