import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { buttonVariants } from "./button";
import { cn } from "../lib/cn";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="Pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-row items-center gap-2", className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  asChild?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({ className, isActive, asChild, ...props }: PaginationLinkProps) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "ghost", size: "sm" }),
        "h-10 min-w-10 px-3",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious(props: React.ComponentProps<typeof PaginationLink>) {
  return <PaginationLink aria-label="Go to previous page" {...props}>Previous</PaginationLink>;
}

function PaginationNext(props: React.ComponentProps<typeof PaginationLink>) {
  return <PaginationLink aria-label="Go to next page" {...props}>Next</PaginationLink>;
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex h-10 w-10 items-center justify-center text-sm text-[var(--color-muted-foreground)]", className)}
      {...props}
    >
      …
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
};
