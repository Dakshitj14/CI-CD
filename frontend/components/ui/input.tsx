"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 shadow-sm outline-none transition focus:border-neon/60 focus:ring-2 focus:ring-neon/20",
        className,
      )}
      {...props}
    />
  );
}
