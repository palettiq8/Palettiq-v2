import type { ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

interface AccountContentProps {
  children: ReactNode;
}

export function AccountContent({ children }: AccountContentProps) {
  return (
    <main id="account-content" className="h-full min-h-0 min-w-0 flex-1">
      <ScrollArea className="h-full w-full">
        <div className="p-6">{children}</div>
      </ScrollArea>
    </main>
  );
}
