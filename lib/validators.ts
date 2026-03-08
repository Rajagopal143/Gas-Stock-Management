import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  shopName: z.string().optional().default(""),
  address: z.string().optional().default(""),
  area: z.string().optional().default(""),
  notes: z.string().optional().default("")
});

export const inventorySchema = z.object({
  cylinderType: z.enum(["14.2kg Domestic", "19kg Commercial"]),
  quantity: z.number().int().min(0),
  purchasePrice: z.number().min(0),
  sellingPrice: z.number().min(0)
});

export const purchaseSchema = z.object({
  supplier: z.string().min(1),
  cylinderType: z.enum(["14.2kg Domestic", "19kg Commercial"]),
  quantity: z.number().int().positive(),
  pricePerCylinder: z.number().positive(),
  purchaseDate: z.string().optional()
});

export const deliverySchema = z.object({
  customerId: z.string().min(1),
  cylinderType: z.enum(["14.2kg Domestic", "19kg Commercial"]),
  quantity: z.number().int().positive(),
  pricePerCylinder: z.number().positive(),
  deliveryDate: z.string().optional(),
  status: z.enum(["pending", "completed"]).default("pending"),
  notes: z.string().optional().default("")
});
