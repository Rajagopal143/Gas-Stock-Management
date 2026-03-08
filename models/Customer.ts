import { Schema, model, models } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    shopName: String,
    address: String,
    area: String,
    notes: String
  },
  { timestamps: true }
);

export default models.Customer || model("Customer", customerSchema);
