import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-gray-100 text-gray-700",
};

export default function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
