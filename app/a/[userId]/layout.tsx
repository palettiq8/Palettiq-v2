import type { ReactNode } from "react";
import { Suspense } from "react";

import { AccountSidebar } from "@/components/Account/AccountSidebar";
import { AccountContent } from "@/components/Account/AccountContent";

interface AccountLayoutProps {
  children: ReactNode;
  params: Promise<{
    userId: string;
  }>;
}

interface AccountLayoutContentProps {
  children: ReactNode;
  params: Promise<{
    userId: string;
  }>;
}

export default function AccountLayout({
  children,
  params,
}: AccountLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100dvh-4rem)] min-h-0 w-full overflow-hidden">
          <aside className="h-full w-64 shrink-0 border-r bg-background" />
          <main className="h-full min-w-0 flex-1 bg-background" />
        </div>
      }
    >
      <AccountLayoutContent params={params}>{children}</AccountLayoutContent>
    </Suspense>
  );
}

async function AccountLayoutContent({
  children,
  params,
}: AccountLayoutContentProps) {
  const { userId } = await params;

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 w-full overflow-hidden">
      <Suspense
        fallback={
          <aside className="h-full w-64 shrink-0 border-r bg-background" />
        }
      >
        <AccountSidebar userId={userId} />
      </Suspense>

      <Suspense
        fallback={
          <main className="h-full min-h-0 min-w-0 flex-1 bg-background" />
        }
      >
        <AccountContent>{children}</AccountContent>
      </Suspense>
    </div>
  );
}
