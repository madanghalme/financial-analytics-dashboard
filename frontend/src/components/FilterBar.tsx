import { CalendarDays, Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { Filters } from "../types";

type Props = { filters: Filters; setFilters: (next: Filters) => void; users: string[] };

export function FilterBar({ filters, setFilters, users }: Props) {
  const set = (key: keyof Filters, value: string) => setFilters({ ...filters, [key]: value });
  return (
    <div className="filter-panel">
      <div className="filter-top">
        <div className="section-title"><SlidersHorizontal size={18}/> Filters</div>
        <button className="ghost-btn compact" onClick={() => setFilters({search:"",category:"",status:"",userId:"",dateFrom:"",dateTo:"",amountMin:"",amountMax:""})}><RotateCcw size={15}/> Reset</button>
      </div>
      <div className="filter-grid">
        <div className="field search-field"><label>Search</label><div className="input-with-icon"><Search size={16}/><input placeholder="ID, category, status, user…" value={filters.search} onChange={e => set("search", e.target.value)}/></div></div>
        <div className="field"><label>Category</label><select value={filters.category} onChange={e => set("category", e.target.value)}><option value="">All categories</option><option>Revenue</option><option>Expense</option></select></div>
        <div className="field"><label>Status</label><select value={filters.status} onChange={e => set("status", e.target.value)}><option value="">All status</option><option>Paid</option><option>Pending</option></select></div>
        <div className="field"><label>User</label><select value={filters.userId} onChange={e => set("userId", e.target.value)}><option value="">All users</option>{users.map(u => <option key={u}>{u}</option>)}</select></div>
        <div className="field"><label><CalendarDays size={13}/> From</label><input type="date" value={filters.dateFrom} onChange={e => set("dateFrom", e.target.value)}/></div>
        <div className="field"><label><CalendarDays size={13}/> To</label><input type="date" value={filters.dateTo} onChange={e => set("dateTo", e.target.value)}/></div>
        <div className="field"><label>Min amount</label><input type="number" min="0" placeholder="0" value={filters.amountMin} onChange={e => set("amountMin", e.target.value)}/></div>
        <div className="field"><label>Max amount</label><input type="number" min="0" placeholder="No limit" value={filters.amountMax} onChange={e => set("amountMax", e.target.value)}/></div>
      </div>
      <div className="filter-active"><Filter size={14}/> Filters apply to charts, metrics, table and CSV export.</div>
    </div>
  );
}
