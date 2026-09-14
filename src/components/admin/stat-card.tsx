import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
}

export function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <div className="flex items-start justify-between border border-border bg-surface p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
        <p className={cn("mt-2 text-2xl font-medium tabular-nums text-ink", tone === "warning" && "text-warning")}>{value}</p>
      </div>
      <Icon size={20} strokeWidth={1.5} className={cn("text-ink-faint", tone === "warning" && "text-warning")} />
    </div>
  );
}
