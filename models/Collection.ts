import { Schema, model, models } from "mongoose";

const collectionSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], default: "Cash" },
    notes: String
  },
  { timestamps: true }
);

export default models.Collection || model("Collection", collectionSchema);
