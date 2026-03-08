import { Schema, model, models } from "mongoose";

const deliverySchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    quantity: { type: Number, required: true },
    pricePerCylinder: { type: Number, required: true },
    discountPerCylinder: { type: Number, default: 0 },
    deliveryDate: { type: Date, default: Date.now },
    notes: String
  },
  { timestamps: true }
);

export default models.Delivery || model("Delivery", deliverySchema);
