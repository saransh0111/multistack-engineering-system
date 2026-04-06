#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

required_sections=(
  "## Purpose"
  "## When to Use"
  "## Input Format"
  "## Output Format"
  "## Execution Logic"
  "## Rules"
  "## Constraints"
  "## Examples"
  "## Output Style"
)

required_dirs=(
  "skills/backend"
  "skills/frontend"
  "skills/mobile"
  "skills/finance"
  "skills/caveman"
  "skills/infra"
  "skills/cross-cutting"
  "skills/security-optimization"
  "skills/messaging"
  "skills/exploration"
  "skills/product-management"
)

required_skills=(
  "skills/backend/backend-best-practices.skill"
  "skills/backend/distributed-transactions.skill"
  "skills/backend/domain-driven-hexagon.skill"
  "skills/backend/idempotency-handling.skill"
  "skills/backend/eventual-consistency.skill"
  "skills/backend/service-discovery.skill"
  "skills/backend/config-management.skill"
  "skills/backend/feature-flags.skill"
  "skills/backend/api-versioning.skill"
  "skills/backend/schema-evolution.skill"
  "skills/backend/database-sharding.skill"
  "skills/backend/multi-region-deployment.skill"
  "skills/backend/system-design-playbook.skill"
  "skills/backend/node-service-best-practices.skill"
  "skills/frontend/design-system-generator.skill"
  "skills/frontend/frontend-design-direction.skill"
  "skills/frontend/component-system-primitives.skill"
  "skills/frontend/web-design-review.skill"
  "skills/messaging/kafka-system-design.skill"
  "skills/messaging/mqtt-realtime-architecture.skill"
  "skills/messaging/chat-system-design.skill"
  "skills/messaging/event-schema-design.skill"
  "skills/messaging/message-reliability.skill"
  "skills/security-optimization/secure-api-design.skill"
  "skills/security-optimization/auth-security-hardening.skill"
  "skills/security-optimization/owasp-top10-defense.skill"
  "skills/security-optimization/secure-storage.skill"
  "skills/security-optimization/secure-deployment.skill"
  "skills/security-optimization/rate-limiting-strategies.skill"
  "skills/security-optimization/caching-strategy.skill"
  "skills/security-optimization/database-optimization.skill"
  "skills/security-optimization/concurrency-optimization.skill"
  "skills/security-optimization/chaos-engineering.skill"
  "skills/security-optimization/resilience-patterns.skill"
  "skills/cross-cutting/choose-optimal-algorithm.skill"
  "skills/cross-cutting/concurrency-handling.skill"
  "skills/cross-cutting/real-world-pattern-matcher.skill"
  "skills/cross-cutting/god-mode.skill"
  "skills/exploration/find-best-library.skill"
  "skills/exploration/compare-libraries.skill"
  "skills/exploration/tech-stack-decision.skill"
  "skills/exploration/package-evaluation.skill"
  "skills/product-management/swot-analysis.skill"
  "skills/product-management/pestle-analysis.skill"
  "skills/product-management/product-feasibility.skill"
  "skills/product-management/mvp-definition.skill"
  "skills/product-management/feature-prioritization.skill"
  "skills/product-management/business-model-analysis.skill"
  "skills/product-management/go-to-market-strategy.skill"
  "skills/product-management/competitive-analysis.skill"
  "skills/product-management/product-metrics.skill"
  "skills/product-management/unit-economics.skill"
  "skills/product-management/consultant-thinking.skill"
  "skills/product-management/translate-business-to-tech.skill"
  "skills/product-management/feature-impact-analysis.skill"
  "skills/product-management/product-decision-engine.skill"
  "skills/product-management/pm-caveman.skill"
)

errors=0

echo "Validating required skill directories..."
for dir in "${required_dirs[@]}"; do
  if [[ ! -d "$dir" ]]; then
    echo "ERROR: missing directory $dir"
    errors=1
  fi
done

echo "Validating required named skills..."
for skill in "${required_skills[@]}"; do
  if [[ ! -f "$skill" ]]; then
    echo "ERROR: missing skill $skill"
    errors=1
  fi
done

echo "Validating skill contracts..."
while IFS= read -r file; do
  first_line="$(head -n 1 "$file")"
  if [[ "$first_line" != "---" ]]; then
    echo "ERROR: missing frontmatter start in $file"
    errors=1
  fi

  for section in "${required_sections[@]}"; do
    if ! rg -q "^${section//\//\\/}$" "$file"; then
      echo "ERROR: missing section '$section' in $file"
      errors=1
    fi
  done
done < <(find skills -type f -name '*.skill' | sort)

total_skills="$(find skills -type f -name '*.skill' | wc -l | tr -d ' ')"
echo "Validated $total_skills skill files."

if [[ "$errors" -ne 0 ]]; then
  echo "Validation failed."
  exit 1
fi

echo "Validation passed."
