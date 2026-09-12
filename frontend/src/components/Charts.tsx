import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import type { Summary } from "../types";

export function Charts({ summary }: { summary: Summary }) {
  const currency = (v: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v)}`;
  return (
    <div className="charts-grid">
      <article className="chart-card wide"><div className="chart-head"><div><p className="eyebrow">TREND</p><h3>Revenue vs expenses</h3></div><span className="chart-note">Monthly</span></div>
        <div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={summary.monthly}><CartesianGrid vertical={false} strokeDasharray="3 4"/><XAxis dataKey="label" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v => `₹${Math.round(v/1000)}k`}/><Tooltip formatter={(v: any) => currency(v)} /><Line type="monotone" dataKey="revenue" strokeWidth={2.5} dot={false} name="Revenue"/><Line type="monotone" dataKey="expenses" strokeWidth={2.5} dot={false} name="Expenses"/></LineChart></ResponsiveContainer></div>
      </article>
      <article className="chart-card"><div className="chart-head"><div><p className="eyebrow">MIX</p><h3>Category breakdown</h3></div></div>
        <div className="chart donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={summary.byCategory} dataKey="value" nameKey="category" innerRadius={55} outerRadius={82} paddingAngle={3}>{summary.byCategory.map((_, i) => <Cell key={i} fill={i === 0 ? "var(--accent)" : "var(--expense)"}/>)}</Pie><Tooltip formatter={(v: any) => currency(v)}/></PieChart></ResponsiveContainer></div>
        <div className="legend">{summary.byCategory.map((x,i) => <span key={x.category}><i className={i===0 ? "revenue-dot" : "expense-dot"} />{x.category}<strong>{currency(x.value)}</strong></span>)}</div>
      </article>
      <article className="chart-card"><div className="chart-head"><div><p className="eyebrow">ACTIVITY</p><h3>Monthly volume</h3></div></div>
        <div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={summary.monthly}><CartesianGrid vertical={false} strokeDasharray="3 4"/><XAxis dataKey="label" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v => `₹${Math.round(v/1000)}k`}/><Tooltip formatter={(v: any) => currency(v)}/><Bar dataKey="revenue" name="Revenue" fill="var(--accent)" radius={[4,4,0,0]}/><Bar dataKey="expenses" name="Expenses" fill="var(--expense)" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
      </article>
    </div>
  );
}
