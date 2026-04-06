import * as React from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@multistack/frontend-primitives";

const tableRows = [
  { product: "Revenue intelligence", status: "Shipping", owner: "Platform" },
  { product: "Workflow orchestration", status: "Review", owner: "Product" },
  { product: "Board reporting", status: "Planned", owner: "Finance" }
];

export function App() {
  const [toastOpen, setToastOpen] = React.useState(false);

  return (
    <TooltipProvider>
      <ToastProvider swipeDirection="right">
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10">
          <header className="grid gap-4 md:grid-cols-[1.4fr,0.8fr] md:items-end">
            <div className="space-y-4">
              <Badge variant="accent">Open-code primitive package</Badge>
              <div className="space-y-3">
                <h1 className="font-[var(--font-display)] text-5xl font-semibold leading-[0.96] tracking-tight md:text-7xl">
                  Frontend primitives with actual code, not just standards.
                </h1>
                <p className="max-w-2xl text-base text-[var(--color-muted-foreground)] md:text-lg">
                  This showcase app exercises the package surface inside the same repository so the
                  design system stays inspectable, editable, and reusable.
                </p>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardDescription>Package status</CardDescription>
                <CardTitle>@multistack/frontend-primitives</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-[var(--color-muted-foreground)]">
                <p>Tailwind-backed tokens and Radix-powered behavior.</p>
                <p>Workspace package, tests, showcase app, and documented export surface.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setToastOpen(true)}>Trigger toast</Button>
              </CardFooter>
            </Card>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardDescription>Buttons and surfaces</CardDescription>
                <CardTitle>Core tone</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Badge>Neutral badge</Badge>
                <Badge variant="success">Healthy</Badge>
                <Badge variant="warning">Watch</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Forms</CardDescription>
                <CardTitle>Inputs and selection</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input autoComplete="organization" id="company" placeholder="Northwind Holdings" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="segment">Segment</Label>
                  <Select defaultValue="enterprise">
                    <SelectTrigger id="segment">
                      <SelectValue placeholder="Select a segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="mid-market">Mid-market</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Capture launch constraints, rollout risks, and owner notes." />
                </div>
                <label className="flex items-center gap-3 text-sm">
                  <Checkbox defaultChecked />
                  Enable staged rollout
                </label>
                <div className="grid gap-3">
                  <Label>Rollout mode</Label>
                  <RadioGroup defaultValue="staged">
                    <label className="flex items-center gap-3 text-sm">
                      <RadioGroupItem value="staged" />
                      Staged
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                      <RadioGroupItem value="canary" />
                      Canary
                    </label>
                  </RadioGroup>
                </div>
                <label className="flex items-center justify-between gap-4 rounded-[var(--radius-field)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm">
                  <span>Customer-visible experiment</span>
                  <Switch defaultChecked />
                </label>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <Card>
              <CardHeader>
                <CardDescription>Data display</CardDescription>
                <CardTitle>Table primitive</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableRows.map((row) => (
                      <TableRow key={row.product}>
                        <TableCell>{row.product}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>{row.owner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Navigation and overlays</CardDescription>
                <CardTitle>Interactive primitives</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Open dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Launch readiness review</DialogTitle>
                      <DialogDescription>
                        Dialog uses a Radix-backed accessible focus trap and package tokens.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Open drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Right-side workspace</DrawerTitle>
                      <DrawerDescription>
                        Use the drawer for contextual editing or deeper drill-downs.
                      </DrawerDescription>
                    </DrawerHeader>
                  </DrawerContent>
                </Drawer>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost">Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      Popovers are useful for lightweight editing, metadata, or contextual guidance.
                    </p>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>Accessible tooltip content.</TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
            <Card>
              <CardHeader>
                <CardDescription>Search and command flows</CardDescription>
                <CardTitle>Command primitive</CardTitle>
              </CardHeader>
              <CardContent>
                <Command>
                  <CommandInput placeholder="Type a command or search…" />
                  <CommandList>
                    <CommandEmpty>No result found.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                      <CommandItem>Dashboard</CommandItem>
                      <CommandItem>Workflows</CommandItem>
                      <CommandItem>Investments</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>State grouping</CardDescription>
                <CardTitle>Tabs primitive</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="risk">Risk</TabsTrigger>
                  </TabsList>
                  <TabsContent className="text-sm text-[var(--color-muted-foreground)]" value="overview">
                    Overview surfaces should be scannable and hierarchy-first.
                  </TabsContent>
                  <TabsContent className="text-sm text-[var(--color-muted-foreground)]" value="activity">
                    Activity views should prioritize chronology, filtering, and URL-reflected state.
                  </TabsContent>
                  <TabsContent className="text-sm text-[var(--color-muted-foreground)]" value="risk">
                    Risk views should use restrained color and strong explanatory copy.
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr,1fr]">
            <Card>
              <CardHeader>
                <CardDescription>Disclosure and FAQ patterns</CardDescription>
                <CardTitle>Accordion primitive</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion className="grid gap-3" collapsible defaultValue="item-1" type="single">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Why keep primitives open-code?</AccordionTrigger>
                    <AccordionContent>
                      Teams can inspect, adapt, and extend the actual components instead of waiting on an external package release cycle.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Why pair Radix with local styles?</AccordionTrigger>
                    <AccordionContent>
                      Behavior stays accessible and reliable while visual language stays owned by the product team.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Navigation helpers</CardDescription>
                <CardTitle>Pagination primitive</CardTitle>
              </CardHeader>
              <CardContent>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </section>

          <Toast open={toastOpen} onOpenChange={setToastOpen}>
            <ToastTitle>Primitive package ready</ToastTitle>
            <ToastDescription>
              This toast is rendered from the shared package and tokenized against the same theme.
            </ToastDescription>
          </Toast>
          <ToastViewport />
        </main>
      </ToastProvider>
    </TooltipProvider>
  );
}
