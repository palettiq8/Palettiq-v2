"use server";

import { createClient } from "@/lib/supabase/server";

type MagicLinkResult = { success: true } | { success: false; error: string };

export async function sendMagicLink(email: string): Promise<MagicLinkResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return {
      success: false,
      error: "Authentication configuration is missing.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    console.error("Magic link error:", error.message);

    return {
      success: false,
      error: "Unable to send the sign-in link. Please try again later.",
    };
  }

  return {
    success: true,
  };
}
