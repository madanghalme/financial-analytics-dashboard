import { useEffect, useMemo, useState } from "react";
import {
  Bell, CalendarDays, ChevronDown, CircleDollarSign, CreditCard, Download,
  Grid2X2, LineChart as LineChartIcon, LogOut, Menu, MessageSquare,
  MoreHorizontal, RefreshCw, Search, Settings, SlidersHorizontal, UserCircle2,
  Users, WalletCards, X
} from "lucide-react";
import type { Filters, Summary, Transaction, User } from "../types";
import { api, ApiError } from "../lib/api";
import { AlertChip } from "../components/AlertChip";
import { ExportModal } from "../components/ExportModal";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const emptyFilters: Filters = { search:"", category:"", status:"", userId:"", dateFrom:"", dateTo:"", amountMin:"", amountMax:"" };

const nav = [
  { label: "Dashboard", icon: Grid2X2 },
  { label: "Transactions", icon: CreditCard },
  { label: "Wallet", icon: WalletCards },
  { label: "Analytics", icon: LineChartIcon },
  { label: "Personal", icon: Users },
  { label: "Message", icon: MessageSquare },
  { label: "Setting", icon: Settings }
];

const money = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:2 });

function avatar(seed: string) {
  const n = Math.abs(seed.split("").reduce((a,c)=>a+c.charCodeAt(0),0)) % 70 + 1;
  return `https://i.pravatar.cc/80?img=${n}`;
}

function Stat({ icon: Icon, title, value, tone }: { icon:any; title:string; value:string; tone:string }) {
  return (
    <article className="penta-stat">
      <div className={`penta-stat-icon ${tone}`}><Icon size={16}/></div>
      <div><span>{title}</span><strong>{value}</strong></div>
    </article>
  );
}

function RecentTransactions({ rows }: { rows: Transaction[] }) {
  return (
    <article className="penta-recent">
      <div className="penta-panel-title"><h3>Recent Transaction</h3><button>See all</button></div>
      <div className="recent-list">
        {rows.slice(0,3).map((row, i) => (
          <div className="recent-row" key={row.id}>
            <img src={avatar(row.user_id + i)} alt="" />
            <div className="recent-main">
              <span>{row.category === "Revenue" ? "Transfer from" : "Transfer to"}</span>
              <strong>{row.user_id}</strong>
            </div>
            <b className={row.category === "Revenue" ? "income-text" : "expense-text"}>
              {row.category === "Revenue" ? "+" : "-"}{money.format(row.amount).replace("$","$")}
            </b>
          </div>
        ))}
      </div>
    </article>
  );
}

export function Dashboard({ user, onLogout }: { user: User; onLogout: ()=>void }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [rows, setRows] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total:0, totalPages:1 });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const filterKey = JSON.stringify(filters);
  useEffect(() => { setPage(1); }, [filterKey]);

  async function load() {
    setLoading(true); setError("");
    try {
      const [table, stats] = await Promise.all([
        api.transactions(filters, page, 10, sortBy, sortOrder),
        api.summary(filters)
      ]);
      setRows(table.items);
      setPagination({ total: table.pagination.total, totalPages: table.pagination.totalPages });
      setSummary(stats);
      setUsers(prev => Array.from(new Set([...prev, ...table.items.map(x => x.user_id)])).sort());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load dashboard data");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filterKey, page, sortBy, sortOrder]);

  function sort(field: string) {
    if (sortBy === field) setSortOrder(v => v === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortOrder("desc"); }
  }

  const income = summary?.revenue ?? 0;
  const expenses = summary?.expenses ?? 0;
  const savings = summary?.net ?? 0;

  return (
    <div className="penta-app">
      <aside className={`penta-sidebar ${mobileNav ? "open" : ""}`}>
        <div className="penta-logo"><span><BarChartIcon /></span><b>Penta</b></div>
        <nav>
          {nav.map(({label,icon:Icon},i) => (
            <button key={label} className={i===0 ? "active" : ""} onClick={()=>setMobileNav(false)}>
              <Icon size={15}/><span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {mobileNav && <div className="penta-nav-overlay" onClick={()=>setMobileNav(false)} />}

      <div className="penta-main">
        <header className="penta-topbar">
          <button className="mobile-menu" onClick={()=>setMobileNav(true)}><Menu size={20}/></button>
          <div className="penta-top-title">Dashboard</div>
          <div className="penta-top-actions">
            <div className="top-search"><Search size={13}/><input placeholder="Search..." value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})}/></div>
            <button className="top-icon"><Bell size={15}/><i/></button>
            <img className="top-avatar" src={avatar(user.id + user.name)} alt={user.name}/>
          </div>
        </header>

        <main className="penta-content">
          {error && <AlertChip message={error} onClose={()=>setError("")}/>}

          <section className="penta-stats">
            <Stat icon={CircleDollarSign} title="Balance" value={summary ? money.format(savings) : "$—"} tone="balance"/>
            <Stat icon={WalletCards} title="Revenue" value={summary ? money.format(income) : "$—"} tone="revenue"/>
            <Stat icon={CreditCard} title="Expenses" value={summary ? money.format(expenses) : "$—"} tone="expenses"/>
            <Stat icon={CircleDollarSign} title="Savings" value={summary ? money.format(savings) : "$—"} tone="savings"/>
          </section>

          <section className="penta-overview-grid">
            <article className="penta-overview">
              <div className="penta-panel-title">
                <h3>Overview</h3>
                <div className="penta-legend">
                  <span><i className="dot income-dot"/>Income</span>
                  <span><i className="dot expense-dot"/>Expenses</span>
                  <select><option>Monthly</option><option>Weekly</option></select>
                </div>
              </div>
              <div className="penta-chart">
                {loading && !summary ? <div className="penta-loading"><div className="spinner"/>Loading…</div> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={summary?.monthly ?? []} margin={{top:10,right:4,left:-25,bottom:0}}>
                      <CartesianGrid vertical={false} stroke="#2a303b" strokeDasharray="2 4"/>
                      <XAxis dataKey="label" tick={{fontSize:9,fill:"#737b8b"}} tickLine={false} axisLine={false}/>
                      <YAxis tick={{fontSize:9,fill:"#737b8b"}} tickLine={false} axisLine={false}/>
                      <Tooltip contentStyle={{background:"#20242e",border:"1px solid #303744",borderRadius:8,color:"#fff",fontSize:11}}/>
                      <Line type="monotone" dataKey="revenue" stroke="#20c45a" strokeWidth={2} dot={false} name="Income"/>
                      <Line type="monotone" dataKey="expenses" stroke="#d8a523" strokeWidth={2} dot={false} name="Expenses"/>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </article>
            <RecentTransactions rows={rows}/>
          </section>

          <section className="penta-transactions">
            <div className="penta-trans-head">
              <div><h2>Transactions</h2><span>{pagination.total.toLocaleString("en-US")} records</span></div>
              <div className="penta-table-actions">
                <div className="penta-table-search"><Search size={14}/><input placeholder="Search for anything..." value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})}/></div>
                <div className="date-range"><CalendarDays size={13}/> {filters.dateFrom || "10 May"} - {filters.dateTo || "20 May"}</div>
                <button className="penta-filter" onClick={()=>document.getElementById("filter-panel")?.classList.toggle("show")}><SlidersHorizontal size={14}/></button>
                <button className="penta-export" onClick={()=>setShowExport(true)}><Download size={14}/> Export</button>
              </div>
            </div>

            <div id="filter-panel" className="penta-filter-panel">
              <div><label>Category</label><select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})}><option value="">All</option><option>Revenue</option><option>Expense</option></select></div>
              <div><label>Status</label><select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">All</option><option>Paid</option><option>Pending</option></select></div>
              <div><label>User</label><select value={filters.userId} onChange={e=>setFilters({...filters,userId:e.target.value})}><option value="">All</option>{users.map(u=><option key={u}>{u}</option>)}</select></div>
              <div><label>Min</label><input type="number" value={filters.amountMin} onChange={e=>setFilters({...filters,amountMin:e.target.value})}/></div>
              <div><label>Max</label><input type="number" value={filters.amountMax} onChange={e=>setFilters({...filters,amountMax:e.target.value})}/></div>
              <button onClick={()=>setFilters(emptyFilters)}>Reset</button>
            </div>

            <div className="penta-table-wrap">
              <table className="penta-table">
                <thead><tr>
                  <th>Name</th><th><button onClick={()=>sort("date")}>Date {sortBy==="date" ? (sortOrder==="asc"?"↑":"↓") : "↕"}</button></th>
                  <th><button onClick={()=>sort("amount")}>Amount {sortBy==="amount" ? (sortOrder==="asc"?"↑":"↓") : "↕"}</button></th>
                  <th><button onClick={()=>sort("status")}>Status {sortBy==="status" ? (sortOrder==="asc"?"↑":"↓") : "↕"}</button></th><th/>
                </tr></thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id}>
                      <td><div className="person-cell"><img src={avatar(row.user_id+i)}/><span>{row.user_id}</span></div></td>
                      <td>{new Date(row.date).toLocaleDateString("en-US",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</td>
                      <td className={row.category==="Revenue" ? "income-text" : "expense-text"}>{row.category==="Revenue" ? "+" : "-"}{money.format(row.amount)}</td>
                      <td><span className={`penta-status ${row.status.toLowerCase()}`}>{row.status==="Paid" ? "Completed" : "Pending"}</span></td>
                      <td><button className="more-btn"><MoreHorizontal size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!rows.length && <div className="penta-empty">No transactions found. Try changing your filters.</div>}
            </div>

            <div className="penta-pagination">
              <span>Showing {rows.length ? ((page-1)*10+1) : 0}–{Math.min(page*10,pagination.total)} of {pagination.total}</span>
              <div><button disabled={page<=1} onClick={()=>setPage(page-1)}>‹</button><button disabled={page>=pagination.totalPages} onClick={()=>setPage(page+1)}>›</button></div>
            </div>
          </section>

          <footer className="penta-footer">
            <span>© 2026 Penta-style Financial Dashboard</span>
            <button onClick={async()=>{try{await api.logout()}catch{} localStorage.removeItem("ledgeriq_token"); onLogout();}}><LogOut size={13}/> Logout</button>
          </footer>
        </main>
      </div>

      {showExport && <ExportModal filters={filters} onClose={()=>setShowExport(false)} onError={setError}/>}
    </div>
  );
}

function BarChartIcon() {
  return <><span className="penta-mark-a"/><span className="penta-mark-b"/></>;
}
