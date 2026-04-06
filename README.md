# multistack-engineering-system

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Skills](https://img.shields.io/badge/skills-Cursor%20%7C%20IDE-6366f1.svg)](./SKILL-GUIDE.md)

Structured **skills** and **engineering rules** for AI-assisted development across backend, frontend, mobile, infrastructure, security, product strategy, and quantitative finance. Designed for use with [Cursor](https://cursor.com) and similar editors that support file-attached context.

This repository contains **documentation and configuration**, not a deployable application. The primary artifacts are `.skill` files under `skills/` and standards under `rules/`.

---

## Contents

- [Overview](#overview)
- [What’s included](#whats-included)
- [Documentation](#documentation)
- [Getting started](#getting-started)
- [Repository layout](#repository-layout)
- [Skill format](#skill-format)
- [Domains](#domains)
- [Design principles](#design-principles)
- [Examples](#examples)
- [Validation](#validation)
- [Reference implementations](#reference-implementations)
- [Contributing](#contributing)
- [Maintainer](#maintainer)
- [License](#license)

---

## Overview

**multistack-engineering-system** is an internal **operating model** for how assistants should respond: predictable inputs, explicit constraints, and structured outputs—rather than ad hoc prompts.

| Goal | How this repo supports it |
|------|-----------------------------|
| Consistency | Shared `rules/` and repeatable skill contracts |
| Depth | Domain-specific skills (APIs, mobile, DCF, security, etc.) |
| Composition | Multiple skills can be chained for larger questions |
| Governance | `scripts/validate-skills.sh` checks structure after edits |

**Intended audience:** software teams, independent builders, and anyone standardizing AI-assisted workflows across several stacks (e.g. SaaS backends, web and mobile clients, and finance-heavy analysis).

---

## What’s included

| Path | Description |
|------|-------------|
| [`SKILL-GUIDE.md`](SKILL-GUIDE.md) | Primary entry: how skills work, how to combine them, and worked examples. |
| [`skills/`](./skills) | `.skill` files organized by domain (see [Domains](#domains)). |
| [`rules/`](./rules) | Markdown standards: APIs, logging, naming, frontend, mobile, finance calculations. |
| [`scripts/validate-skills.sh`](./scripts/validate-skills.sh) | Validator for required sections and layout. |
| [`reference/`](./reference/README.md) | **Optional** sample code (currently a React + Vite workspace under `reference/frontend/`). Not required to use skills or rules. |

---

## Documentation

| Resource | Purpose |
|--------|---------|
| [SKILL-GUIDE.md](SKILL-GUIDE.md) | Onboarding, skill contract, chaining patterns. |
| [rules/](rules/) | Cross-cutting engineering standards. |

For a large or ambiguous task, start with [`skills/cross-cutting/god-mode.skill`](skills/cross-cutting/god-mode.skill), then narrow to domain-specific skills.

---

## Getting started

### 1. Clone

```bash
git clone https://github.com/saransh0111/multistack-engineering-system.git
cd multistack-engineering-system
```

You can also add this repo as a **git submodule** inside an application repository.

### 2. Read the guide

Open [SKILL-GUIDE.md](SKILL-GUIDE.md) before editing or invoking skills.

### 3. Use skills in your editor

Reference a skill with a path your tool understands (example for Cursor-style `@` attachment):

```text
@multistack-engineering-system/skills/backend/api-versioning.skill

We need a versioning plan for a public mobile API with slow client upgrades.
Return support window, deprecation path, and contract test policy.
```

Adjust the path to match where you cloned the repository.

### 4. Validate after changes

```bash
./scripts/validate-skills.sh
```

---

## Repository layout

```text
multistack-engineering-system/
├── SKILL-GUIDE.md
├── README.md
├── scripts/
│   └── validate-skills.sh
├── rules/
├── skills/
│   ├── backend/
│   ├── frontend/
│   ├── mobile/
│   ├── finance/
│   ├── infra/
│   ├── messaging/
│   ├── security-optimization/
│   ├── exploration/
│   ├── product-management/
│   ├── cross-cutting/
│   └── caveman/
└── reference/
    └── frontend/
        ├── packages/
        └── apps/
```

---

## Skill format

Each skill is written for **predictable, composable** outputs. Typical sections include:

1. Purpose  
2. When to use  
3. Input format  
4. Output format  
5. Execution logic  
6. Rules  
7. Constraints  
8. Examples  
9. Output style  

Exact structure may vary by file; the validator and [SKILL-GUIDE.md](SKILL-GUIDE.md) define the contract.

---

## Domains

| Domain | Focus (examples) |
|--------|--------------------|
| `backend` | APIs, services, consistency, scaling, versioning, multi-region |
| `frontend` | Architecture, UI primitives, theming, accessibility, performance, auth |
| `mobile` | Android, iOS, Flutter, multi-brand delivery |
| `finance` | Valuation, statements, risk, portfolio, macro (structured outputs) |
| `infra` | CI/CD, containers, secrets, migrations |
| `messaging` | Kafka, MQTT, chat, contracts, reliability |
| `security-optimization` | Secure APIs, authentication, hardening, rate limits, resilience |
| `product-management` | Strategy, feasibility, prioritization, GTM, metrics, unit economics |
| `exploration` | Stack and library evaluation |
| `cross-cutting` | Multi-domain orchestration |
| `caveman` | High-density, token-efficient responses |

---

## Design principles

- Prefer **deterministic, structured** answers over open-ended prose where the skill defines a contract.  
- Treat **security and data handling** seriously when security-related skills apply.  
- Surface **tradeoffs** explicitly (performance, complexity, operational cost).  
- Align engineering guidance with **production practice**, not textbook-only ideals.  
- Where product or finance skills apply, keep outputs **actionable** (decisions, metrics, risks).

---

## Examples

**Single skill**

```text
@skills/backend/api-versioning.skill

Public mobile API; slow client upgrades. Need deprecation window and contract tests.
```

**Multiple skills**

```text
@skills/cross-cutting/god-mode.skill
@skills/product-management/product-decision-engine.skill
@skills/backend/distributed-transactions.skill
@skills/security-optimization/secure-deployment.skill

Evaluate a new payments workflow: product decision, architecture, deployment risk.
```

---

## Validation

```bash
./scripts/validate-skills.sh
```

The script checks mandatory sections, frontmatter, expected domain folders, and registry expectations used by this repository’s validator.

---

## Reference implementations

The [`reference/`](reference/README.md) directory holds **optional** sample implementations. It does not define the skill format. Today it includes a **frontend** workspace (`reference/frontend/`): React primitives and a Vite showcase. Skip this folder if you only need skills and rules.

---

## Contributing

Issues and pull requests are welcome: skill improvements, new rules, documentation clarity, and validator fixes. Please run `./scripts/validate-skills.sh` before submitting changes that touch `skills/`.

---

## Maintainer

**Saransh Nirmalkar**  
Creator and maintainer of `multistack-engineering-system`

- Email: [saransh0111@gmail.com](mailto:saransh0111@gmail.com)
- GitHub: [@saransh0111](https://github.com/saransh0111)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Disclaimer

Skills and rules are **templates and standards for your workflows**, not guaranteed production advice. Apply judgment, review outputs, and test changes in your own environments before relying on them for compliance, security, or financial decisions.
