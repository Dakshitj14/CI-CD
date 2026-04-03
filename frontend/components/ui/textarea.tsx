"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 shadow-sm outline-none transition focus:border-neon/60 focus:ring-2 focus:ring-neon/20",
        className,
      )}
      {...props}
    />
  );
}
