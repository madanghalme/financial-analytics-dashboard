import { FormEvent, useState } from "react";
import { BarChart3, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { api, ApiError } from "../lib/api";
import type { User } from "../types";
import { AlertChip } from "./AlertChip";

export function Login({ onLoggedIn }: { onLoggedIn: (token: string, user: User) => void }) {
  const [email, setEmail] = useState("analyst@example.com");
  const [password, setPassword] = useState("Password@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api.login(email, password);
      localStorage.setItem("ledgeriq_token", result.token);
      onLoggedIn(result.token, result.user);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand large"><span className="brand-mark"><BarChart3 size={22}/></span> LedgerIQ</div>
        <div>
          <p className="eyebrow">FINANCIAL INTELLIGENCE</p>
          <h1>See the story behind every transaction.</h1>
          <p className="auth-copy">A focused command center for revenue, expenses, transaction health and export-ready reporting.</p>
        </div>
        <div className="auth-points">
          <span><ShieldCheck size={17}/> JWT-protected analytics</span>
          <span><BarChart3 size={17}/> Live visual reporting</span>
          <span><LockKeyhole size={17}/> Secure transaction access</span>
        </div>
      </section>

      <section className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div className="mobile-brand brand"><span className="brand-mark"><BarChart3 size={19}/></span> LedgerIQ</div>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your workspace</h2>
          <p className="muted">Use your analyst credentials to continue.</p>

          {error && <AlertChip message={error} />}

          <label>Email address</label>
          <div className="input-with-icon"><Mail size={18}/><input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" required /></div>

          <label>Password</label>
          <div className="input-with-icon"><LockKeyhole size={18}/><input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} autoComplete="current-password" required /><button type="button" className="input-action" onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>

          <button className="primary-btn full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
          <p className="demo-hint">Demo: <strong>analyst@example.com</strong> · <strong>Password@123</strong></p>
        </form>
      </section>
    </main>
  );
}
