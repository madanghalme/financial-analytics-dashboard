import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { Transaction } from "../types";

type Props = {
  rows: Transaction[];
  page: number;
  totalPages: number;
  total: number;
  setPage: (n:number)=>void;
  sortBy: string;
  sortOrder: string;
  onSort: (field:string)=>void;
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export function TransactionTable({ rows, page, totalPages, total, setPage, sortBy, sortOrder, onSort }: Props) {
  const Sort = ({ field }: { field: string }) => sortBy === field ? (sortOrder === "asc" ? <ArrowUp size={14}/> : <ArrowDown size={14}/>) : <ArrowUpDown size={14}/>;
  return (
    <article className="table-card">
      <div className="table-head"><div><p className="eyebrow">TRANSACTIONS</p><h3>Transaction ledger</h3><p className="muted">{total.toLocaleString("en-IN")} matching records</p></div></div>
      <div className="table-wrap">
        <table>
          <thead><tr>{[
            ["id","ID"],["date","Date"],["amount","Amount"],["category","Category"],["status","Status"],["user_id","User"]
          ].map(([field,label]) => <th key={field}><button className="sort-btn" onClick={() => onSort(field)}>{label}<Sort field={field}/></button></th>)}<th>Profile</th></tr></thead>
          <tbody>{rows.map(row => <tr key={row.id}>
            <td className="id-cell">#{row.id}</td>
            <td>{new Date(row.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</td>
            <td className="amount-cell">{money.format(row.amount)}</td>
            <td><span className={`category ${row.category.toLowerCase()}`}>{row.category}</span></td>
            <td><span className={`status ${row.status.toLowerCase()}`}>{row.status}</span></td>
            <td>{row.user_id}</td>
            <td><a className="profile-link" href={row.user_profile} target="_blank" rel="noreferrer"><ExternalLink size={14}/></a></td>
          </tr>)}</tbody>
        </table>
        {!rows.length && <div className="empty-state"><div className="empty-icon">⌁</div><h4>No transactions found</h4><p>Try changing your filters or search term.</p></div>}
      </div>
      <div className="pagination"><span>Page {page} of {totalPages}</span><div><button className="icon-btn" disabled={page <= 1} onClick={()=>setPage(page-1)}><ChevronLeft size={18}/></button><button className="icon-btn" disabled={page >= totalPages} onClick={()=>setPage(page+1)}><ChevronRight size={18}/></button></div></div>
    </article>
  );
}
