# Rule: Frontend Standards

**Owner:** Frontend Engineering
**Last Updated:** 2026-04-06
**Applies To:** All web applications (React, Next.js, TypeScript)

---

## Core Principle

Frontend work must feel intentional.

- No generic SaaS sameness.
- No default `Inter` plus gray cards unless the existing product already uses that language.
- No motion or decoration without narrative purpose.
- No accessibility tradeoff for aesthetics.
- No component sprawl without a primitive system.

Every meaningful frontend task must answer five questions up front:

1. What is the page or flow trying to make the user feel?
2. Which visual archetype fits the product: editorial, utilitarian, premium, playful, technical, institutional, or brutalist-lite?
3. Which typography system expresses that archetype?
4. Which component primitives and tokens enforce consistency?
5. Which accessibility and performance constraints shape the execution?

---

## Design Direction Workflow

Before implementation, define:

```yaml
design_direction:
  product_mode: "marketing" | "dashboard" | "hybrid" | "storytelling" | "commerce"
  visual_archetype: "editorial" | "technical" | "premium" | "playful" | "institutional" | "minimal"
  emotional_goal: string
  tension: string
  typography_pair:
    display: string
    body: string
  palette_mode: "monochrome-plus-accent" | "warm-contrast" | "cool-contrast" | "earthy" | "high-signal"
  motion_profile: "static" | "subtle" | "expressive" | "cinematic"
```

Rules:

- Marketing pages need a visual point of view. Neutral is usually wrong.
- Dashboards must prioritize scan speed, hierarchy, and data comprehension over decoration.
- Storytelling pages may be expressive, but content still loads fast and remains readable without motion.
- If the project already has a design system, extend it instead of inventing a new visual language.

---

## Component System

### Primitive-First Architecture

Build or extend a small primitive layer inspired by the discipline of high-quality component systems:

- `Button`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `RadioGroup`
- `Dialog`
- `Popover`
- `Tooltip`
- `DropdownMenu`
- `Tabs`
- `Accordion`
- `Table`
- `Toast`
- `Card`
- `Badge`
- `Skeleton`

Rules:

- Prefer accessible primitives with well-defined state behavior.
- Composition beats giant configurable components.
- Variants belong in the primitive system, not ad hoc across features.
- Visual states must be token-driven: hover, focus, active, disabled, destructive, loading.
- Any component reused 3+ times must either graduate into a primitive or stay clearly feature-local.

### File Organization

```text
src/
├── app/ or pages/
├── components/
│   ├── primitives/
│   ├── composite/
│   └── icons/
├── features/
│   ├── invoices/
│   │   ├── components/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   └── index.ts
├── lib/
├── styles/
│   ├── tokens/
│   ├── themes/
│   └── globals.css
└── types/
```

### Component Rules

- One component per file.
- Export through index files for stable import surfaces.
- Keep feature components thin; push repeated visual logic into primitives.
- Use semantic HTML first, ARIA second.
- Every primitive must document states, keyboard behavior, and focus behavior.

---

## Typography

Typography must be chosen, not inherited by accident.

### Default Direction Rules

- Editorial or premium marketing:
  - Use a display serif or high-character grotesk paired with a readable sans.
- Technical or product-led marketing:
  - Use a distinctive grotesk or neo-grotesk with a restrained mono accent.
- Dashboards:
  - Prioritize legibility and tabular alignment. Use a clean sans plus mono for numeric or code-like data.

### Approved Pairing Patterns

| Pattern | Display | Body | Use Case |
|---|---|---|---|
| Editorial premium | Fraunces / Cormorant / Playfair | Manrope / Source Sans 3 | Brand-heavy landing pages |
| Modern technical | Space Grotesk / Sora | Instrument Sans / Plus Jakarta Sans | Devtools, infra, B2B software |
| Institutional clarity | IBM Plex Sans | IBM Plex Sans / IBM Plex Mono | Enterprise dashboards, admin |
| Friendly product | DM Sans / General Sans | DM Sans / Inter alternative such as Manrope | Lightweight SaaS |
| Numeric heavy | Geist / Plus Jakarta Sans | Geist / JetBrains Mono | Analytics and finance UI |

Rules:

- Do not default to `Inter` unless the existing product already uses it.
- Keep body text readable at normal zoom and 200% zoom.
- Use a type scale with explicit rhythm, not arbitrary text sizes.
- Numbers in finance or analytics surfaces should use tabular numerals.

---

## Color and Themes

### Design Token Structure

- Primitive tokens: raw hues, spacing, radius, shadows.
- Semantic tokens: background, foreground, border, accent, danger, success.
- Component tokens: button-primary-bg, card-surface, input-ring.

### Palette Rules

- Use one dominant accent and one supporting accent at most.
- Neutral palettes should still have temperature: cool, warm, graphite, sand, etc.
- High-contrast surfaces matter more than decorative gradients.
- Dark mode must be designed, not color-inverted.

### Theme Modes

- `marketing-theme`
- `app-theme`
- `brand-theme`
- `dark-theme`
- `high-contrast-theme`

Rules:

- Themes must remain accessible across all states.
- Accent colors must be validated on buttons, links, charts, badges, and focus rings.
- Multi-brand systems must swap tokens without component rewrites.

---

## Layout and Section Design

### Archetypes

| Archetype | When to Use | Key Traits |
|---|---|---|
| Editorial | Story-led landing pages | strong typography, asymmetric rhythm, big imagery |
| Product narrative | B2B marketing | feature pacing, proof blocks, controlled motion |
| Dense dashboard | Data and operations | clear hierarchy, sticky structure, fast scanning |
| Utility app | Repeat workflows | minimal chrome, strong affordances |
| Showcase | Portfolio, launch, campaign | distinct visual hook, scroll rhythm, dramatic contrast |

### Section Rules

- Alternate density and whitespace intentionally.
- Every page needs an obvious focal point.
- Avoid endless identical card rows.
- Use visual contrast to separate proof, explanation, and action.
- Empty, loading, and error states must preserve the page's design language.

---

## Motion

### Motion Profile Rules

- `static`: almost no animation beyond state feedback.
- `subtle`: small entrance, hover, and state transitions.
- `expressive`: staggered reveals, spatial transitions, and section choreography.
- `cinematic`: storytelling pages only, heavily profiled, strong fallbacks.

Rules:

- Animate `transform` and `opacity` first.
- Respect `prefers-reduced-motion`.
- Scroll-linked motion must degrade cleanly on low-end hardware.
- Do not block comprehension behind animation timing.
- Motion should reinforce hierarchy, causality, or delight. Not all three at once.

---

## Accessibility

All interfaces target WCAG 2.1 AA minimum unless a stronger requirement is stated.

### Required Checks

| Criterion | Requirement |
|---|---|
| Keyboard navigation | Every interactive element reachable and usable |
| Focus visibility | Strong, visible focus ring |
| Contrast | 4.5:1 for normal text, 3:1 for large text |
| Labels | Every input has a real label |
| Structure | Correct landmarks and heading order |
| Status communication | Never color-only |
| Motion | Reduced-motion path supported |
| Touch target | 44x44px minimum on mobile |
| Dynamic updates | Live regions or equivalent announcements where needed |

Rules:

- Prefer native HTML over custom ARIA-heavy widgets.
- Dialogs must trap focus and restore it on close.
- Menus, tabs, accordions, comboboxes, and lists must follow expected keyboard patterns.
- Data visualizations need textual interpretation or accessible summaries.

---

## Forms and Interaction Details

Rules:

- Icon-only controls must have `aria-label`.
- Inputs need meaningful `label`, `name`, `autocomplete`, and appropriate `type` or `inputmode`.
- Never block paste in form fields.
- Use `button` for actions and `a` for navigation. Do not fake semantics with `div`.
- Reflect meaningful UI state in the URL for filters, tabs, search, sort, or pagination when shareability or back-button behavior matters.
- Prefer `:focus-visible` over global focus suppression.
- Keep keyboard behavior aligned with platform expectations for dialogs, tabs, menus, comboboxes, and accordions.

---

## Copy and Content Polish

Rules:

- Use real ellipsis `…`, not three periods, in polished UI copy when truncation is intentional.
- Use tabular numerals for aligned numeric data in dashboards, finance surfaces, and comparisons.
- Dates, times, numbers, and currency must use `Intl.DateTimeFormat` and `Intl.NumberFormat`.
- Error copy must explain the problem and next action, not only state failure.
- Empty states must explain what the user can do next.

---

## Layout Resilience

Rules:

- Flex children containing truncating text must use `min-w-0`.
- Images must declare width and height or reserve space to avoid layout shift.
- Sticky headers and anchor links must account for `scroll-margin-top`.
- Full-bleed mobile surfaces must respect `env(safe-area-inset-top/right/bottom/left)`.
- Long labels, translated copy, and unbroken strings must be tested for overflow.

---

## Rendering and Browser Behavior

Rules:

- Use `color-scheme` correctly when supporting dark mode so browser UI and form controls render coherently.
- Avoid hydration-sensitive logic in server-rendered content without a stable fallback.
- Expensive client-only features need a no-JS or low-JS fallback when the surface is SEO- or content-critical.
- Set `touch-action` deliberately on drag or gesture-heavy surfaces to avoid scroll conflict.

---

## Data Visualization

Chart choice must fit the question.

| Question | Preferred Chart |
|---|---|
| Trend over time | line |
| Composition at a point | stacked bar or treemap |
| Ranking | horizontal bar |
| Distribution | histogram or box plot |
| Correlation | scatter |
| Funnel conversion | funnel or stepped bars |
| Small KPI delta | sparkline plus value plus delta |

Rules:

- Do not use pie charts unless categories are few and differences are obvious.
- Every chart needs clear labels, units, and empty-state handling.
- Use color sparingly; hierarchy should come from layout and labels first.
- Tooltips must not be the only way to understand the chart.

---

## Performance Budgets

| Metric | Budget | Tool |
|---|---|---|
| Total JS bundle (initial) | < 200 KB gzipped for marketing, < 300 KB for app shell | bundle analyzer |
| Largest Contentful Paint | < 2.5s | Lighthouse, Web Vitals |
| Cumulative Layout Shift | < 0.1 | Lighthouse, Web Vitals |
| Interaction to Next Paint | < 200ms | Chrome UX Report |
| Time to Interactive | < 3.5s | Lighthouse |
| Third-party JS | < 50 KB unless justified | bundle analyzer |

Rules:

- Route-level code splitting by default.
- Lazy-load heavy animation and charting libraries.
- Optimize images and always reserve layout space.
- Virtualize long lists.
- Avoid client-rendering content that could be static or server-rendered.
- Profile on low-end mobile hardware for animation-heavy pages.

---

## State and Data

- Local UI state stays local.
- Server state lives in React Query or equivalent query layer.
- URL state is preferred for filters, sorts, pagination, tabs, and shareable UI.
- Global client state is for truly global concerns only.
- Do not duplicate server state in local stores.

---

## Review Gates

Before review:

- No TypeScript errors
- No lint errors
- Loading, empty, and error states handled
- Keyboard path tested
- Mobile viewport tested
- Lighthouse and bundle impact checked
- Reduced-motion path checked if motion exists
- Design direction documented for any new page or major redesign

Reviewer checklist:

- Visual language is intentional, not generic
- Primitive system is respected
- Accessibility and performance are preserved
- Motion adds value and does not create jank
- Page hierarchy is obvious within 5 seconds

---

## Anti-Patterns

- Default `Inter` plus blue gradient plus rounded cards with no product rationale
- Giant hero with no content hierarchy
- Repeated anonymous card grids with identical spacing and no pacing
- Custom widgets where native controls would work
- Dark mode as simple inversion
- Decorative motion that slows reading
- Charts with unlabeled axes or tooltip-only meaning
- Over-configurable components that replace composition
