import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import PurchaseOrder from "@/models/PurchaseOrder";

export async function GET() {
  await connectDB();
  const [deliveries, purchases] = await Promise.all([Delivery.find({}), PurchaseOrder.find({})]);
  const totalRevenue = deliveries.reduce((s, d) => s + d.quantity * d.pricePerCylinder, 0);
  const totalExpense = purchases.reduce((s, p) => s + p.totalCost, 0);
  const now = new Date();
  const day = new Date(now); day.setHours(0,0,0,0);
  const week = new Date(now); week.setDate(now.getDate()-7);
  const month = new Date(now.getFullYear(), now.getMonth(), 1);

  const calc = (start: Date) => deliveries.filter((d)=>new Date(d.deliveryDate)>=start).reduce((s,d)=>s+d.quantity*d.pricePerCylinder,0) - purchases.filter((p)=>new Date(p.purchaseDate)>=start).reduce((s,p)=>s+p.totalCost,0);

  return NextResponse.json({
    dailyProfit: calc(day),
    weeklyProfit: calc(week),
    monthlyProfit: calc(month),
    totalRevenue,
    totalExpense
  });
}
