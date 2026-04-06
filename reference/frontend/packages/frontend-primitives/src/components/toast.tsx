import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

import { cn } from "../lib/cn";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn("fixed right-4 top-4 z-[100] flex max-h-screen w-[min(92vw,420px)] flex-col gap-2 outline-none", className)}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      "group pointer-events-auto relative flex w-full items-start justify-between gap-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4 text-[var(--color-foreground)] shadow-[var(--shadow-floating)] data-[state=open]:animate-[toast-in_180ms_ease-out] data-[state=closed]:animate-[toast-out_160ms_ease-in]",
      className
    )}
    {...props}
  />
));

Toast.displayName = ToastPrimitive.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));

ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-muted-foreground)]", className)}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitive.Description.displayName;

const ToastAction = ToastPrimitive.Action;
const ToastClose = ToastPrimitive.Close;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose
};
