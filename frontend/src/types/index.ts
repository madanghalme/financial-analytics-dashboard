export type Category = "Revenue" | "Expense";
export type Status = "Paid" | "Pending";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: Category;
  status: Status;
  user_id: string;
  user_profile: string;
}

export interface Filters {
  search: string;
  category: string;
  status: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

export interface Summary {
  totalAmount: number;
  revenue: number;
  expenses: number;
  net: number;
  transactionCount: number;
  pendingCount: number;
  byCategory: { category: string; value: number; count: number }[];
  monthly: { label: string; revenue: number; expenses: number }[];
}

export const ALL_COLUMNS = [
  "id",
  "date",
  "amount",
  "category",
  "status",
  "user_id",
  "user_profile"
] as const;
export type ExportColumn = typeof ALL_COLUMNS[number];
