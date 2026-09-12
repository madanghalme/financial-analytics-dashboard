import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
  user_profile: string;
}

const schema = new Schema<ITransaction>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true, index: true },
    category: { type: String, enum: ["Revenue", "Expense"], required: true, index: true },
    status: { type: String, enum: ["Paid", "Pending"], required: true, index: true },
    user_id: { type: String, required: true, index: true },
    user_profile: { type: String, required: true }
  },
  { timestamps: true }
);

schema.index({ date: -1, category: 1 });
schema.index({ status: 1, user_id: 1 });

export const Transaction = mongoose.model<ITransaction>("Transaction", schema);
