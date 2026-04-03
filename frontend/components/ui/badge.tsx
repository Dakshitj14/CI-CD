"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger";
};

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-white/10 text-white border-white/10",
  success: "bg-emerald-500/16 text-emerald-300 border-emerald-400/20",
  warning: "bg-amber-500/16 text-amber-200 border-amber-400/20",
  danger: "bg-red-500/16 text-red-200 border-red-400/20",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
