import { Schema, model, models } from "mongoose";

const deliverySchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    cylinderType: { type: String, enum: ["14.2kg Domestic", "19kg Commercial"], required: true },
    quantity: { type: Number, required: true },
    pricePerCylinder: { type: Number, required: true },
    deliveryDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    notes: String
  },
  { timestamps: true }
);

export default models.Delivery || model("Delivery", deliverySchema);
