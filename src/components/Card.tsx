import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-md border border-gray-200 bg-white p-5 ${className}`}>
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
}
