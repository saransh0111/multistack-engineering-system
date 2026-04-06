import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./dialog";
import { cn } from "../lib/cn";

const drawerVariants = cva(
  "fixed z-50 grid gap-4 border border-[var(--color-border)] bg-[var(--color-panel)] p-6 text-[var(--color-foreground)] shadow-[var(--shadow-floating)] duration-200",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-[min(92vw,28rem)] border-l rounded-l-[var(--radius-panel)] data-[state=open]:animate-[drawer-in-right_180ms_ease-out]",
        left: "inset-y-0 left-0 h-full w-[min(92vw,28rem)] border-r rounded-r-[var(--radius-panel)] data-[state=open]:animate-[drawer-in-left_180ms_ease-out]"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);

type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DialogContent> &
  VariantProps<typeof drawerVariants>;

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, side, ...props }, ref) => (
    <DialogContent
      ref={ref}
      className={cn(
        "left-auto top-auto -translate-x-0 -translate-y-0 w-auto max-w-none",
        drawerVariants({ side }),
        className
      )}
      {...props}
    />
  )
);

DrawerContent.displayName = "DrawerContent";

const Drawer = Dialog;

export {
  Drawer,
  DrawerContent,
  DialogTrigger as DrawerTrigger,
  DialogClose as DrawerClose,
  DialogHeader as DrawerHeader,
  DialogFooter as DrawerFooter,
  DialogTitle as DrawerTitle,
  DialogDescription as DrawerDescription
};
