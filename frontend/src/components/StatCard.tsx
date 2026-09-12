import { ArrowDownRight, ArrowUpRight, CircleDollarSign, Clock3, ReceiptText, WalletCards } from "lucide-react";

const icons = {
  revenue: CircleDollarSign,
  expenses: ArrowDownRight,
  net: WalletCards,
  pending: Clock3,
  transactions: ReceiptText
};

export function StatCard({ title, value, tone, delta }: { title: string; value: string; tone: keyof typeof icons; delta?: string }) {
  const Icon = icons[tone];
  const positive = tone === "revenue" || tone === "net";
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19}/></div>
      <div className="stat-body"><span>{title}</span><strong>{value}</strong>{delta && <small className={positive ? "positive" : ""}>{positive ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>} {delta}</small>}</div>
    </article>
  );
}
