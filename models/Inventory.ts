import { Schema, model, models } from "mongoose";

const inventorySchema = new Schema(
  {
    quantity: { type: Number, required: true, default: 0 },
    purchasePrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export default models.Inventory || model("Inventory", inventorySchema);
