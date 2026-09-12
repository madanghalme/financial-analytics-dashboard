import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import transactionRoutes from "./routes/transactions";
import { errorHandler, notFound } from "./middleware/error";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: false }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "financial-analytics-api" } });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(env.port, () => console.log(`API listening on http://localhost:${env.port}`));
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
