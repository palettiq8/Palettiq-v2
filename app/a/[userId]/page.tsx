
import { Suspense } from "react";
import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ProfileInfoCard } from "@/components/Account/ProfileInfoCard";
import { AccountRecentPalettes } from "@/components/Account/AccountRecentPalettes";

interface AccountOverviewPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function AccountOverviewPage({
  params,
}: AccountOverviewPageProps) {
  return (
    <div className="w-full space-y-1">
      <Suspense
        fallback={
          <div className="h-32 w-full animate-pulse rounded-xl border bg-muted/50" />
        }
      >
        <AccountOverviewContent params={params} />
      </Suspense>
    </div>
  );
}

async function AccountOverviewContent({
  params,
}: AccountOverviewPageProps) {
  await connection();

  const { userId } = await params;

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, username, bio, website")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load account profile.");
  }

  return (
    <div className="w-full space-y-4">
      <ProfileInfoCard profile={profile} />
      <AccountRecentPalettes />
    </div>
  );
}
