# Rule: Logging Standards

**Owner:** Platform Engineering  
**Last Updated:** 2026-04-06  
**Applies To:** All services (Django, Go, Flutter, background workers)

---

## Log Levels

Use log levels consistently across all services:

| Level | When to Use | Examples |
|---|---|---|
| `CRITICAL` | System is unusable. Requires immediate human intervention. | Database connection permanently lost, data corruption detected, payment processor completely unreachable |
| `ERROR` | Operation failed and cannot be retried automatically. A human needs to investigate. | Unhandled exception, failed API call after all retries exhausted, business rule violation that prevents processing |
| `WARNING` | Something unexpected happened but the system recovered or can continue. | Deprecated API called, rate limit approaching threshold, cache miss on hot path, retry succeeded after initial failure |
| `INFO` | Normal operational events worth recording. | Request completed, user logged in, background job started/finished, tenant provisioned, deployment completed |
| `DEBUG` | Detailed diagnostic information for development and troubleshooting. | SQL queries, HTTP request/response bodies, cache hit/miss, internal state transitions. **Never enabled in production by default.** |

### Level Selection Rules

- If you're unsure between `WARNING` and `ERROR`, ask: "Does a human need to act on this?" If yes → `ERROR`.
- If you're unsure between `INFO` and `DEBUG`, ask: "Would I want to see this in production?" If yes → `INFO`.
- Never log expected conditions as `ERROR`. For example, a `404 Not Found` is not an error — it's a normal response.
- Authentication failures are `WARNING` (expected), unless there's a brute-force pattern (then `ERROR`).

---

## Structured JSON Format

All log entries must be structured JSON. No free-form text logs in production.

### Required Fields

| Field | Type | Description |
|---|---|---|
| `timestamp` | string (ISO 8601) | When the event occurred: `2026-04-06T14:32:01.456Z` |
| `level` | string | One of: `CRITICAL`, `ERROR`, `WARNING`, `INFO`, `DEBUG` |
| `service` | string | Service name: `core-api`, `auth-service`, `notification-worker` |
| `message` | string | Human-readable description of the event |
| `trace_id` | string | Distributed trace ID (propagated from request header) |
| `span_id` | string | Current span ID (for distributed tracing) |
| `tenant_id` | string (nullable) | Tenant context (null for system-level events) |

### Optional Fields

| Field | Type | Description |
|---|---|---|
| `user_id` | string | Authenticated user ID |
| `request_id` | string | Unique request identifier |
| `path` | string | HTTP request path |
| `method` | string | HTTP method |
| `status_code` | integer | HTTP response status code |
| `duration_ms` | float | Operation duration in milliseconds |
| `error_type` | string | Exception class name |
| `error_message` | string | Exception message |
| `stack_trace` | string | Full stack trace (only for ERROR/CRITICAL) |
| `context` | object | Additional key-value pairs relevant to the event |

### Example Log Entry

```json
{
  "timestamp": "2026-04-06T14:32:01.456Z",
  "level": "ERROR",
  "service": "core-api",
  "message": "Failed to process invoice payment",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "tenant_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "user_id": "usr_98765",
  "request_id": "req_abc123",
  "path": "/api/v1/invoices/INV-001/pay",
  "method": "POST",
  "status_code": 502,
  "duration_ms": 3042.5,
  "error_type": "PaymentGatewayTimeout",
  "error_message": "Stripe API did not respond within 3000ms",
  "context": {
    "invoice_id": "INV-001",
    "amount": "15000.00",
    "currency": "INR",
    "gateway": "stripe",
    "retry_count": 3
  }
}
```

---

## PII Handling

### Never Log

- Passwords (plaintext or hashed)
- Full credit card numbers
- CVV/CVC codes
- Authentication tokens (JWT, API keys)
- Social Security / Aadhaar numbers
- Full bank account numbers

### Mask Before Logging

| Data Type | Masking Rule | Example |
|---|---|---|
| Email | Show first 2 chars + domain | `sa****@gmail.com` |
| Phone | Show last 4 digits | `****5678` |
| PAN | Show first and last 2 chars | `AB****89Q` |
| IP Address | Log full IP (not PII in most contexts) | `192.168.1.100` |
| Name | Log full name (not PII in most contexts unless regulated) | `Rahul Sharma` |

### Masking Utility

```python
import re

def mask_email(email: str) -> str:
    local, domain = email.split("@")
    return f"{local[:2]}{'*' * (len(local) - 2)}@{domain}"

def mask_phone(phone: str) -> str:
    digits = re.sub(r'\D', '', phone)
    return f"{'*' * (len(digits) - 4)}{digits[-4:]}"

def mask_pan(pan: str) -> str:
    return f"{pan[:2]}{'*' * (len(pan) - 4)}{pan[-2:]}"
```

### Audit Trail

For fields that must be logged for audit but contain PII, log a reference ID instead:

```json
{
  "message": "KYC document verified",
  "context": {
    "document_ref": "DOC-20260406-A1B2C3",
    "document_type": "aadhaar",
    "verification_status": "verified"
  }
}
```

---

## Log Retention Policy

| Environment | Retention | Storage |
|---|---|---|
| Production | 90 days (hot), 1 year (cold/S3) | Elasticsearch → S3 Glacier |
| Staging | 14 days | Elasticsearch |
| Development | 3 days | Local / CloudWatch |

- Logs older than the hot retention period are archived to cold storage.
- Audit logs (authentication, authorization, data access) are retained for **3 years** regardless of environment.
- Logs containing financial transaction data are retained for **7 years** per regulatory requirements.

---

## Metrics and Tracing

- Every request-driven service must expose RED metrics: rate, errors, duration.
- Critical infrastructure components should also expose USE-style metrics where relevant: utilization, saturation, errors.
- Every user-facing critical path must map to an SLI and SLO.
- Trace sampling must be configurable without redeploying.
- Error and high-latency traces should be sampled at a higher rate than successful low-latency traces.

---

## Alerting

- Alert on customer impact or imminent SLO breach, not raw infrastructure noise alone.
- Every paging alert must have:
  - clear symptom
  - likely impact
  - runbook link
  - escalation path
- Non-urgent signals should route to chat or ticket workflows instead of paging.
- Repeated noisy alerts must be tuned or removed quickly.

---

## Correlation ID Propagation

Every request entering the system must have a correlation ID. This ID propagates through all service calls and log entries.

### Flow

```
Client → API Gateway → Service A → Service B → Database
  │          │             │            │
  └── X-Request-ID: abc ──────────────────────────────┘
       (same ID in all log entries for this request)
```

### Implementation (Django)

```python
# middleware/correlation.py
import uuid
from core.context import set_request_id


class CorrelationIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = request.META.get("HTTP_X_REQUEST_ID", str(uuid.uuid4()))
        request.request_id = request_id
        set_request_id(request_id)

        response = self.get_response(request)
        response["X-Request-ID"] = request_id
        return response
```

### Implementation (Go)

```go
func CorrelationMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        requestID := r.Header.Get("X-Request-ID")
        if requestID == "" {
            requestID = uuid.New().String()
        }
        ctx := context.WithValue(r.Context(), "request_id", requestID)
        w.Header().Set("X-Request-ID", requestID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

### Propagation to Downstream Services

When making HTTP calls to other services, always forward the correlation ID:

```python
import requests

def call_downstream(path: str, request_id: str):
    return requests.get(
        f"http://auth-service.internal{path}",
        headers={"X-Request-ID": request_id},
        timeout=5,
    )
```

---

## Performance Logging

Log performance data for operations exceeding these thresholds:

| Operation | Warning Threshold | Error Threshold |
|---|---|---|
| HTTP request (total) | 1000ms | 5000ms |
| Database query | 100ms | 1000ms |
| Redis operation | 10ms | 100ms |
| External API call | 2000ms | 10000ms |
| Background task | 60s | 300s |

### Slow Query Logging

```python
import time
import logging

logger = logging.getLogger("performance")


class QueryTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = (time.monotonic() - start) * 1000

        if duration_ms > 1000:
            logger.warning(
                "Slow request",
                extra={
                    "path": request.path,
                    "method": request.method,
                    "duration_ms": round(duration_ms, 2),
                    "status_code": response.status_code,
                },
            )

        return response
```

---

## Audit Logging

The following events must always be logged at `INFO` level with `audit: true` in context:

- User authentication (login, logout, failed attempts)
- Permission changes (role assignment, access grant/revoke)
- Data access (view sensitive records: PII, financial data)
- Data modification (create, update, delete on critical entities)
- Configuration changes (tenant settings, feature flags)
- API key creation/rotation/revocation
- Export operations (data downloads, report generation)

### Audit Log Format

```json
{
  "timestamp": "2026-04-06T14:32:01.456Z",
  "level": "INFO",
  "service": "core-api",
  "message": "User role updated",
  "audit": true,
  "actor": {
    "user_id": "usr_admin_001",
    "ip_address": "203.0.113.42",
    "user_agent": "Mozilla/5.0..."
  },
  "action": "user.role.update",
  "target": {
    "entity_type": "user",
    "entity_id": "usr_98765"
  },
  "changes": {
    "role": { "from": "member", "to": "admin" }
  },
  "tenant_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```
