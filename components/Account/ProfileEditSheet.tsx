"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export interface ProfileData {
  display_name: string | null;
  username: string | null;
  bio: string | null;
  website: string | null;
}

interface ProfileEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  profile: ProfileData | null;
  onProfileUpdated: (profile: ProfileData) => void;
}

export function ProfileEditSheet({
  open,
  onOpenChange,
  email,
  profile,
  onProfileUpdated,
}: ProfileEditSheetProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setUsername(profile?.username ?? "");
    setDisplayName(profile?.display_name ?? "");
    setBio(profile?.bio ?? "");
    setWebsite(profile?.website ?? "");
  }, [open, profile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    const supabase = createClient();

    setIsSaving(true);

    try {
      const updatedProfile = {
        username: username.trim() || null,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        website: website.trim() || null,
      };

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("You must be logged in to update your profile.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", user.id)
        .select("display_name, username, bio, website")
        .single();

      if (error) {
        throw error;
      }

      onProfileUpdated(data);
      toast.success("Profile updated successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader className="px-5">
          <SheetTitle>Edit profile</SheetTitle>
        </SheetHeader>

        <form
          id="edit-profile-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5"
        >
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" type="email" value={email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-username">Username</Label>
            <Input
              id="profile-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-display-name">Display name</Label>
            <Input
              id="profile-display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Enter your display name"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea
              id="profile-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell something about yourself"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-website">Website</Label>
            <Input
              id="profile-website"
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://example.com"
              autoComplete="url"
            />
          </div>
        </form>

        <SheetFooter className="px-5">
          <Button type="submit" form="edit-profile-form" disabled={isSaving}>
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
