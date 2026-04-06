# @multistack/frontend-primitives

Open-code React primitives for the multistack engineering system.

This package is styled with Tailwind utility classes plus token CSS from `src/styles.css`.

## What It Includes

- tokenized styles via `src/styles.css`
- accessible shared primitives
- workspace-ready build and test scripts
- a showcase app in `apps/frontend-primitives-showcase`

## Current Primitive Surface

- `Button`
- `Badge`
- `Card`
- `Input`
- `Textarea`
- `Label`
- `Dialog`
- `Tabs`
- `Checkbox`
- `RadioGroup`
- `Switch`
- `Select`
- `Accordion`
- `Popover`
- `Tooltip`
- `DropdownMenu`
- `Drawer`
- `Table`
- `Pagination`
- `Toast`
- `Command`

## Usage

```tsx
import "@multistack/frontend-primitives/styles.css";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@multistack/frontend-primitives";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Ship it</Button>
      </CardContent>
    </Card>
  );
}
```

## Workspace Commands

```bash
pnpm install
pnpm build
pnpm test
pnpm dev:showcase
```

The showcase app resolves the package from source during local development, so you can iterate on primitives without publishing or prebuilding.
