import { Schema, model, models } from "mongoose";

const inventorySchema = new Schema(
  {
    cylinderType: { type: String, enum: ["14.2kg Domestic", "19kg Commercial"], required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    purchasePrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export default models.Inventory || model("Inventory", inventorySchema);
