"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CopyColorButtonProps {
  hex: string;
}

export function CopyColorButton({ hex }: CopyColorButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);

      setCopied(true);
      toast.success(`${hex} copied to clipboard`);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      toast.error("Failed to copy color");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      aria-label={`Copy ${hex}`}
      title="Copy HEX"
    >
      {copied ? (
        <Check className="size-4 text-green-600" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
}
