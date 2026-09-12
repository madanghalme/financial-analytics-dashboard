import "dotenv/config";

const required = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required("MONGO_URI", "mongodb://127.0.0.1:27017/financial_analytics"),
  jwtSecret: required("JWT_SECRET", "development-only-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "2h",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? "analyst@example.com",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "Password@123"
};
