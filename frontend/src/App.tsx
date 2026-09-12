import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Dashboard } from "./pages/Dashboard";
import { api } from "./lib/api";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ledgeriq_token");
    if (!token) { setBooting(false); return; }
    api.me().then(result => setUser(result.user)).catch(() => localStorage.removeItem("ledgeriq_token")).finally(() => setBooting(false));
  }, []);

  if (booting) return <div className="boot"><div className="spinner"/><span>Preparing workspace…</span></div>;
  if (!user) return <Login onLoggedIn={(_token, u) => setUser(u)} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
