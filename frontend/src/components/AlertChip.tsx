import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type Props = {
  message: string;
  type?: "error" | "success" | "info";
  onClose?: () => void;
};

export function AlertChip({ message, type = "error", onClose }: Props) {
  const Icon = type === "error" ? AlertCircle : type === "success" ? CheckCircle2 : Info;
  return (
    <div className={`alert-chip ${type}`} role="alert">
      <Icon size={17} />
      <span>{message}</span>
      {onClose && <button className="icon-btn" onClick={onClose} aria-label="Dismiss"><X size={16} /></button>}
    </div>
  );
}
