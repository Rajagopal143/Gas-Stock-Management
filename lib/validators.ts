import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  shopName: z.string().optional().default(""),
  address: z.string().optional().default(""),
  area: z.string().optional().default(""),
  outstandingAmount: z.coerce.number().optional().default(0),
  notes: z.string().optional().default("")
});

export const inventorySchema = z.object({
  quantity: z.number().int().min(0),
  purchasePrice: z.number().min(0),
  sellingPrice: z.number().min(0)
});

export const purchaseSchema = z.object({
  supplier: z.string().min(1),
  quantity: z.number().int().positive(),
  pricePerCylinder: z.number().positive(),
  purchaseDate: z.string().optional()
});

export const deliverySchema = z.object({
  customerId: z.string().min(1),
  quantity: z.number().int().positive(),
  pricePerCylinder: z.number().positive(),
  discountPerCylinder: z.number().min(0).optional().default(0),
  deliveryDate: z.string().optional(),
  notes: z.string().optional().default("")
});
