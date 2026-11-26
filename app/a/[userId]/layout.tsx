import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { AccountSidebar } from "@/components/Account/AccountSidebar";
import { AccountContent } from "@/components/Account/AccountContent";
import { createClient } from "@/lib/supabase/server";

interface AccountLayoutProps {
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
          <aside className="hidden h-full w-64 shrink-0 border-r bg-background md:block" />
          <main className="h-full min-w-0 flex-1 bg-background" />
        </div>
      }
    >
      <AccountLayoutContent params={params}>{children}</AccountLayoutContent>
    </Suspense>
  );
}

async function AccountLayoutContent({ children, params }: AccountLayoutProps) {
  await connection();

  const { userId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  if (user.id !== userId) {
    redirect(`/a/${user.id}`);
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 w-full overflow-hidden">
      <Suspense
        fallback={
          <aside className="hidden h-full w-64 shrink-0 border-r bg-background md:block" />
        }
      >
        <AccountSidebar userId={userId} />
      </Suspense>

      <AccountContent>{children}</AccountContent>
    </div>
  );
}
