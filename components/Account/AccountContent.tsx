import type { ReactNode } from "react";

interface AccountContentProps {
  children: ReactNode;
}

export function AccountContent({ children }: AccountContentProps) {
  return (
    <main className="h-full min-h-0 min-w-0 flex-1 overflow-y-auto">
      <div className="p-5 sm:p-6 lg:p-8">{children}</div>
    </main>
  );
}
