import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]",
        secondary:
          "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[color-mix(in_srgb,var(--color-muted)_75%,var(--color-border))]",
        ghost:
          "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
        destructive:
          "bg-[var(--color-danger)] text-white hover:bg-[color-mix(in_srgb,var(--color-danger)_85%,black)]"
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-5 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
