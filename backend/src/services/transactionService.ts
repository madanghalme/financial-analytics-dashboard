import { stringify } from "csv-stringify/sync";
import { FilterQuery } from "mongoose";
import { Transaction, ITransaction } from "../models/Transaction";

const allowedSort = new Set(["id", "date", "amount", "category", "status", "user_id"]);

export interface TransactionFilters {
  search?: string;
  category?: "Revenue" | "Expense";
  status?: "Paid" | "Pending";
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function buildQuery(filters: TransactionFilters): FilterQuery<ITransaction> {
  const query: FilterQuery<ITransaction> = {};

  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.userId) query.user_id = filters.userId;

  if (filters.dateFrom || filters.dateTo) {
    query.date = {};
    if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) {
      const end = new Date(filters.dateTo);
      end.setUTCHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }

  if (filters.amountMin !== undefined || filters.amountMax !== undefined) {
    query.amount = {};
    if (filters.amountMin !== undefined) query.amount.$gte = filters.amountMin;
    if (filters.amountMax !== undefined) query.amount.$lte = filters.amountMax;
  }

  if (filters.search) {
    const search = filters.search.trim();
    const numeric = Number(search);
    const or: FilterQuery<ITransaction>[] = [
      { category: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
      { user_id: { $regex: search, $options: "i" } }
    ];
    if (Number.isFinite(numeric)) or.push({ id: numeric });
    query.$or = or;
  }

  return query;
}

export async function listTransactions(filters: TransactionFilters, page: number, limit: number) {
  const query = buildQuery(filters);
  const sortField = allowedSort.has(filters.sortBy ?? "") ? filters.sortBy! : "date";
  const direction = filters.sortOrder === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    Transaction.find(query)
      .select("-_id -__v -createdAt -updatedAt")
      .sort({ [sortField]: direction })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query)
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
  };
}

export async function getSummary(filters: TransactionFilters) {
  const query = buildQuery(filters);

  const [summary] = await Transaction.aggregate([
    { $match: query },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              revenue: { $sum: { $cond: [{ $eq: ["$category", "Revenue"] }, "$amount", 0] } },
              expenses: { $sum: { $cond: [{ $eq: ["$category", "Expense"] }, "$amount", 0] } },
              transactionCount: { $sum: 1 },
              pendingCount: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }
            }
          }
        ],
        byCategory: [
          { $group: { _id: "$category", value: { $sum: "$amount" }, count: { $sum: 1 } } },
          { $sort: { value: -1 } }
        ],
        monthly: [
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" }
              },
              revenue: { $sum: { $cond: [{ $eq: ["$category", "Revenue"] }, "$amount", 0] } },
              expenses: { $sum: { $cond: [{ $eq: ["$category", "Expense"] }, "$amount", 0] } }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]
      }
    }
  ]);

  const totals = summary?.totals?.[0] ?? {
    totalAmount: 0, revenue: 0, expenses: 0, transactionCount: 0, pendingCount: 0
  };

  return {
    ...totals,
    net: totals.revenue - totals.expenses,
    byCategory: (summary?.byCategory ?? []).map((x: any) => ({
      category: x._id,
      value: x.value,
      count: x.count
    })),
    monthly: (summary?.monthly ?? []).map((x: any) => ({
      label: `${x._id.year}-${String(x._id.month).padStart(2, "0")}`,
      revenue: x.revenue,
      expenses: x.expenses
    }))
  };
}

export async function exportCsv(filters: TransactionFilters, columns: string[]) {
  const query = buildQuery(filters);
  const allowed = ["id", "date", "amount", "category", "status", "user_id", "user_profile"];
  const selected = columns.filter((c) => allowed.includes(c));
  const finalColumns = selected.length ? selected : allowed;

  const rows = await Transaction.find(query)
    .select("-_id -__v -createdAt -updatedAt")
    .sort({ date: -1, id: -1 })
    .lean();

  const records = rows.map((row: any) => {
    const record: Record<string, unknown> = {};
    for (const col of finalColumns) {
      const value = row[col];
      record[col] = col === "date" && value instanceof Date ? value.toISOString() : value;
    }
    return record;
  });

  return stringify(records, { header: true, columns: finalColumns });
}
