import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gas-stock";

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

let cached = (global as typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached?.conn) return cached.conn;
  if (!cached?.promise) cached!.promise = mongoose.connect(MONGODB_URI, { dbName: "gas-stock-management" });
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
