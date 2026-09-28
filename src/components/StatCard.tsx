import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-border bg-surface p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary-dark">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
