# Reference (optional)

Code here complements the skill pack. It is **not** required to use [`skills/`](../skills/), [`rules/`](../rules/), or [SKILL-GUIDE.md](../SKILL-GUIDE.md).

## Layout

| Folder | What it is |
|--------|------------|
| [`frontend/`](frontend/) | React primitives package + Vite showcase (pnpm workspace). |

Future stacks (e.g. backend snippets) can get sibling folders under `reference/` the same way.

## Frontend workspace

| Path | Description |
|------|-------------|
| `frontend/packages/frontend-primitives` | React + TypeScript UI primitives (button, input, card, dialog, tabs, …). |
| `frontend/apps/frontend-primitives-showcase` | Dev app to preview those components. |

### Setup

```bash
cd reference/frontend
corepack enable
pnpm install
pnpm build
pnpm dev:showcase
```

Use Node 20+ and pnpm 9 (see `packageManager` in `frontend/package.json`).
