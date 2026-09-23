import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-canvas px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
