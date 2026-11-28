import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

const ALLOWED_OTP_TYPES: readonly EmailOtpType[] = [
  "email",
  "magiclink",
  "signup",
  "recovery",
  "invite",
  "email_change",
];

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return (
    value !== null &&
    ALLOWED_OTP_TYPES.includes(value as EmailOtpType)
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const code = searchParams.get("code");
  const typeParam = searchParams.get("type");

  const supabase = await createClient();

  // Preferred flow: token hash works across devices/browsers (the magic link can
  // be opened on a different device from the one that requested it).
  if (tokenHash) {
    const type: EmailOtpType = isEmailOtpType(typeParam)
      ? typeParam
      : "email";

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(new URL("/", origin));
    }

    console.error("Auth confirmation (token) error:", error.message);

    return NextResponse.redirect(
      new URL("/?authError=verification_failed", origin),
    );
  }

  // Fallback flow: PKCE code exchange (same-browser only).
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL("/", origin));
    }

    console.error("Auth confirmation (code) error:", error.message);
  }

  return NextResponse.redirect(
    new URL("/?authError=verification_failed", origin),
  );
}
