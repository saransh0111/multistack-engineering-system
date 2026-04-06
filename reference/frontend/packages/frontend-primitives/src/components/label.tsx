import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../lib/cn";

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      className={cn("text-sm font-medium leading-none text-[var(--color-foreground)]", className)}
      ref={ref}
      {...props}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;
