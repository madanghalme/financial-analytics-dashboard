import { Router } from "express";
import { getTransactionSummary, getTransactions, downloadCsv } from "../controllers/transactionController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", getTransactions);
router.get("/summary", getTransactionSummary);
router.get("/export", downloadCsv);
export default router;
