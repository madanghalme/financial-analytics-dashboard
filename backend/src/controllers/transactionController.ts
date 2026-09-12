import { RequestHandler } from "express";
import { z } from "zod";
import { exportCsv, getSummary, listTransactions, TransactionFilters } from "../services/transactionService";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.enum(["Revenue", "Expense"]).optional(),
  status: z.enum(["Paid", "Pending"]).optional(),
  userId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  amountMin: z.coerce.number().nonnegative().optional(),
  amountMax: z.coerce.number().nonnegative().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

function filtersFromQuery(query: any): TransactionFilters {
  return {
    search: query.search,
    category: query.category,
    status: query.status,
    userId: query.userId,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    amountMin: query.amountMin,
    amountMax: query.amountMax,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder
  };
}

export const getTransactions: RequestHandler = async (req, res, next) => {
  try {
    const q = querySchema.parse(req.query);
    const result = await listTransactions(filtersFromQuery(q), q.page, q.limit);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getTransactionSummary: RequestHandler = async (req, res, next) => {
  try {
    const q = querySchema.parse(req.query);
    const result = await getSummary(filtersFromQuery(q));
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const downloadCsv: RequestHandler = async (req, res, next) => {
  try {
    const q = querySchema.parse(req.query);
    const rawColumns = typeof req.query.columns === "string" ? req.query.columns : "";
    const columns = rawColumns.split(",").map((x) => x.trim()).filter(Boolean);
    const csv = await exportCsv(filtersFromQuery(q), columns);

    const filename = `financial-report-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
