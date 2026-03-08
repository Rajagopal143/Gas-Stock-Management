import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Inventory from "@/models/Inventory";
import Delivery from "@/models/Delivery";
import PurchaseOrder from "@/models/PurchaseOrder";

export async function GET() {
  await connectDB();
  const [customers, inventory, deliveries, purchases] = await Promise.all([
    Customer.countDocuments(),
    Inventory.find({}),
    Delivery.find({}),
    PurchaseOrder.find({})
  ]);

  const stock = inventory.reduce((s, i) => s + i.quantity, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deliveriesToday = deliveries.filter((d) => new Date(d.deliveryDate) >= today);
  const todaysRevenue = deliveriesToday.reduce((s, d) => s + d.quantity * d.pricePerCylinder, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyRevenue = deliveries.filter((d) => new Date(d.deliveryDate) >= monthStart).reduce((s, d) => s + d.quantity * d.pricePerCylinder, 0);
  const monthlyExpense = purchases.filter((p) => new Date(p.purchaseDate) >= monthStart).reduce((s, p) => s + p.totalCost, 0);

  return NextResponse.json({
    totalCustomers: customers,
    cylindersInStock: stock,
    deliveriesToday: deliveriesToday.length,
    todaysRevenue,
    monthlyProfit: monthlyRevenue - monthlyExpense
  });
}
