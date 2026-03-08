import { Schema, model, models } from "mongoose";

const purchaseSchema = new Schema(
  {
    supplier: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerCylinder: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default models.PurchaseOrder || model("PurchaseOrder", purchaseSchema);
