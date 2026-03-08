import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import PurchaseOrder from "@/models/PurchaseOrder";
import Collection from "@/models/Collection";

export async function GET() {
  await connectDB();
  const [deliveries, purchases, collections] = await Promise.all([
    Delivery.find({}),
    PurchaseOrder.find({}),
    Collection.find({})
  ]);

  const totalRevenue = deliveries.reduce((s, d) => s + d.quantity * d.pricePerCylinder, 0);
  const totalExpense = purchases.reduce((s, p) => s + p.totalCost, 0);
  const totalCollected = collections.reduce((s, c) => s + c.amount, 0);

  const now = new Date();
  const day = new Date(now); day.setHours(0,0,0,0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const calculateProfit = (start: Date) => {
    const rev = deliveries
      .filter((d) => new Date(d.deliveryDate) >= start)
      .reduce((s, d) => s + d.quantity * d.pricePerCylinder, 0);
    const exp = purchases
      .filter((p) => new Date(p.purchaseDate || p.createdAt) >= start)
      .reduce((s, p) => s + p.totalCost, 0);
    return rev - exp;
  };

  const calculateCollections = (start: Date) => {
    return collections
      .filter((c) => new Date(c.paymentDate) >= start)
      .reduce((s, c) => s + c.amount, 0);
  };

  return NextResponse.json({
    dailyProfit: calculateProfit(day),
    weeklyProfit: calculateProfit(weekStart),
    monthlyProfit: calculateProfit(monthStart),
    yearlyProfit: calculateProfit(yearStart),
    
    dailyCollection: calculateCollections(day),
    weeklyCollection: calculateCollections(weekStart),
    monthlyCollection: calculateCollections(monthStart),
    yearlyCollection: calculateCollections(yearStart),

    totalRevenue,
    totalExpense,
    totalCollected
  });
}
