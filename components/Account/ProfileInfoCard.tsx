
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  ProfileEditSheet,
  type ProfileData,
} from "@/components/Account/ProfileEditSheet";

interface ProfileInfoCardProps {
  profile: ProfileData | null;
}

export function ProfileInfoCard({ profile: initialProfile }: ProfileInfoCardProps) {
  const { user, isLoading } = useAuth();

  const [profile, setProfile] = useState(initialProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const displayName = profile?.display_name?.trim() || "Unnamed user";
  const username = profile?.username?.trim();
  const email = user?.email ?? "";

  return (
    <>
      <section className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-17 shrink-0">
            <AvatarImage
              src={user?.user_metadata?.avatar_url ?? ""}
              alt={displayName}
            />
            <AvatarFallback className="text-xl font-semibold">
              {displayName.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1">
            <h2 className="truncate text-lg font-semibold tracking-tight">
              {displayName}
            </h2>

            <p className="truncate text-sm text-muted-foreground">
              {username ? `@${username}` : "Username not set"}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {isLoading ? "Loading email..." : email || "Email unavailable"}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="shrink-0"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="size-4" />
          Edit profile
        </Button>
      </section>

      <ProfileEditSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        email={email}
        profile={profile}
        onProfileUpdated={setProfile}
      />
    </>
  );
}
