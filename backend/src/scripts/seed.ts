import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { connectDb } from "../config/db";
import { env } from "../config/env";
import { User } from "../models/User";
import { Transaction } from "../models/Transaction";

async function main() {
  await connectDb();

  const datasetPath = path.resolve(process.cwd(), "../data/transactions.json");
  const raw = await fs.readFile(datasetPath, "utf-8");
  const data = JSON.parse(raw);

  await Transaction.deleteMany({});
  await Transaction.insertMany(data.map((item: any) => ({
    ...item,
    date: new Date(item.date)
  })));

  const passwordHash = await bcrypt.hash(env.seedAdminPassword, 12);
  await User.findOneAndUpdate(
    { email: env.seedAdminEmail.toLowerCase() },
    { email: env.seedAdminEmail.toLowerCase(), passwordHash, name: "Financial Analyst" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Seeded ${data.length} transactions.`);
  console.log(`Demo login: ${env.seedAdminEmail} / ${env.seedAdminPassword}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
