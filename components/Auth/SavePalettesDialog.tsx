"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Bookmark, CheckCircle2, Loader2, Mail } from "lucide-react";

import { sendMagicLink } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SavePalettesDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setEmail("");
      setError("");
      setEmailSent(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await sendMagicLink(email);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setEmailSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant={"outline"}>
            <Bookmark />
            Save my palettes
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        {!emailSent ? (
          <>
            <DialogHeader>
              <DialogTitle>Save your palettes</DialogTitle>
              <DialogDescription>
                Enter your email address. We&apos;ll send you a secure sign-in
                link. No password required.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="auth-email" className="text-sm font-medium">
                  Email address
                </label>

                <Input
                  id="auth-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    <Mail />
                    Continue with email
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle2 className="size-12 text-primary" />

            <DialogHeader className="items-center">
              <DialogTitle>Check your email</DialogTitle>
              <DialogDescription>
                We&apos;ve sent a sign-in link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Open your inbox and click the link to access Palettiq.
              </DialogDescription>
            </DialogHeader>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmailSent(false);
                setError("");
              }}
            >
              <ArrowLeft />
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
