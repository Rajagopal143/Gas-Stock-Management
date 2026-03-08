import { Schema, model, models } from "mongoose";

const purchaseSchema = new Schema(
  {
    supplier: { type: String, required: true },
    cylinderType: { type: String, enum: ["14.2kg Domestic", "19kg Commercial"], required: true },
    quantity: { type: Number, required: true },
    pricePerCylinder: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default models.PurchaseOrder || model("PurchaseOrder", purchaseSchema);
