import { useState } from "react";
import { Check, Download, FileSpreadsheet, X } from "lucide-react";
import type { ExportColumn, Filters } from "../types";
import { ALL_COLUMNS } from "../types";
import { api } from "../lib/api";

const labels: Record<ExportColumn, string> = {
  id: "Transaction ID", date: "Date", amount: "Amount", category: "Category",
  status: "Status", user_id: "User ID", user_profile: "Profile URL"
};

export function ExportModal({ filters, onClose, onError }: { filters: Filters; onClose: () => void; onError: (m: string) => void }) {
  const [selected, setSelected] = useState<ExportColumn[]>(["id","date","amount","category","status","user_id"]);
  const [loading, setLoading] = useState(false);

  const toggle = (column: ExportColumn) => setSelected(prev => prev.includes(column) ? prev.filter(x => x !== column) : [...prev, column]);
  async function download() {
    if (!selected.length) return;
    setLoading(true);
    try {
      const blob = await api.exportCsv(filters, selected);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-report-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      onClose();
    } catch (e) {
      onError(e instanceof Error ? e.message : "CSV export failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head"><div><p className="eyebrow">REPORT BUILDER</p><h3>Export transactions</h3><p className="muted">Choose exactly what your CSV should contain.</p></div><button className="icon-btn" onClick={onClose}><X/></button></div>
        <div className="export-preview"><FileSpreadsheet size={20}/><div><strong>CSV report</strong><span>Current filters are preserved in the export.</span></div><span className="selected-count">{selected.length}/{ALL_COLUMNS.length}</span></div>
        <div className="column-grid">{ALL_COLUMNS.map(col => <button key={col} className={`column-option ${selected.includes(col) ? "selected" : ""}`} onClick={() => toggle(col)}><span>{selected.includes(col) ? <Check size={16}/> : <span className="empty-check"/>}</span>{labels[col]}</button>)}</div>
        <div className="modal-actions"><button className="ghost-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={!selected.length || loading} onClick={download}><Download size={17}/>{loading ? "Generating…" : "Download CSV"}</button></div>
      </div>
    </div>
  );
}
