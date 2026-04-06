import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "../lib/cn";

const Chevron = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" height="18" viewBox="0 0 18 18" width="18">
    <path
      d="m4.5 7 4.5 4.5L13.5 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("overflow-hidden rounded-[var(--radius-field)] border border-[var(--color-border)] bg-[var(--color-panel)]", className)}
    {...props}
  />
));

AccordionItem.displayName = AccordionPrimitive.Item.displayName;

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-[var(--color-muted)]/45",
        className
      )}
      {...props}
    >
      {children}
      <Chevron className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm text-[var(--color-muted-foreground)] data-[state=closed]:animate-[accordion-up_180ms_ease-out] data-[state=open]:animate-[accordion-down_220ms_ease-out]",
      className
    )}
    {...props}
  >
    <div className="px-4 pb-4 pt-1">{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
