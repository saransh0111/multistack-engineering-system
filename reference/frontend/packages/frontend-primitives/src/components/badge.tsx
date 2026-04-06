import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-[0.04em] transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)]",
        accent:
          "border-transparent bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)] text-[var(--color-accent)]",
        success:
          "border-transparent bg-[color-mix(in_srgb,var(--color-success)_16%,transparent)] text-[var(--color-success)]",
        warning:
          "border-transparent bg-[color-mix(in_srgb,var(--color-warning)_16%,transparent)] text-[var(--color-warning)]",
        danger:
          "border-transparent bg-[color-mix(in_srgb,var(--color-danger)_16%,transparent)] text-[var(--color-danger)]"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
