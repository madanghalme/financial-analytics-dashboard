import type { Filters, Summary, Transaction, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function token(): string | null {
  return localStorage.getItem("ledgeriq_token");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  const jwt = token();
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await response.text();
  let body: any = {};
  try { body = text ? JSON.parse(text) : {}; } catch {}

  if (!response.ok) {
    throw new ApiError(body.message ?? "Request failed", response.status);
  }
  return body.data as T;
}

function queryString(filters: Filters, extra: Record<string, string | number> = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key === "userId" ? "userId" : key, value);
  });
  Object.entries(extra).forEach(([key, value]) => params.set(key, String(value)));
  return params.toString();
}

export const api = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },
  async me(): Promise<{ user: User }> {
    return request("/auth/me");
  },
  async logout(): Promise<void> {
    await request("/auth/logout", { method: "POST" });
  },
  async transactions(filters: Filters, page: number, limit: number, sortBy: string, sortOrder: string) {
    return request<{ items: Transaction[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      `/transactions?${queryString(filters, { page, limit, sortBy, sortOrder })}`
    );
  },
  async summary(filters: Filters): Promise<Summary> {
    return request(`/transactions/summary?${queryString(filters)}`);
  },
  async exportCsv(filters: Filters, columns: string[]) {
    const qs = queryString(filters);
    const joiner = qs ? `${qs}&` : "";
    const response = await fetch(`${API_URL}/transactions/export?${joiner}columns=${encodeURIComponent(columns.join(","))}`, {
      headers: { Authorization: `Bearer ${token()}` }
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(body.message ?? "CSV export failed", response.status);
    }
    return response.blob();
  }
};
