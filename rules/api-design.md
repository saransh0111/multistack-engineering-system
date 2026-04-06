# Rule: API Design Standards

**Owner:** Platform Engineering  
**Last Updated:** 2026-04-06  
**Applies To:** All HTTP APIs (internal and external)

---

## Resource Naming

- Use **plural nouns** for collections: `/users`, `/invoices`, `/transactions`
- Use **kebab-case** for multi-word resources: `/fund-houses`, `/nav-histories`, `/payment-methods`
- Nest resources to express relationships: `/tenants/{tenant_id}/users/{user_id}`
- Maximum nesting depth: **2 levels**. Beyond that, promote to a top-level resource with a filter parameter.
- Resource identifiers in URLs must be UUIDs or slugs, never sequential integers.

```
GET    /api/v1/investment-funds               # list funds
GET    /api/v1/investment-funds/{fund_id}     # get single fund
GET    /api/v1/investment-funds/{fund_id}/holdings  # nested resource
POST   /api/v1/investment-funds/{fund_id}/analyze   # action (verb is acceptable for non-CRUD)
```

---

## HTTP Method Semantics

| Method | Purpose | Idempotent | Safe | Request Body |
|---|---|---|---|---|
| `GET` | Retrieve resource(s) | Yes | Yes | No |
| `POST` | Create resource or trigger action | No | No | Yes |
| `PUT` | Full replacement of resource | Yes | No | Yes |
| `PATCH` | Partial update of resource | No* | No | Yes |
| `DELETE` | Remove resource | Yes | No | No |

*`PATCH` is idempotent only when using JSON Merge Patch. With JSON Patch, it may not be.

- **Never** use `GET` for operations that modify state.
- **Never** use `POST` when `PUT` or `PATCH` is semantically correct.
- Use `POST` for actions that don't map to CRUD (e.g., `/orders/{id}/cancel`).

---

## Status Code Usage

### Success

| Code | When |
|---|---|
| `200 OK` | Successful GET, PUT, PATCH, or DELETE that returns a body |
| `201 Created` | Successful POST that creates a resource. Include `Location` header. |
| `202 Accepted` | Request accepted for async processing (e.g., report generation) |
| `204 No Content` | Successful DELETE or PUT/PATCH with no response body |

### Client Error

| Code | When |
|---|---|
| `400 Bad Request` | Malformed JSON, missing required field, invalid field value |
| `401 Unauthorized` | No valid authentication credentials provided |
| `403 Forbidden` | Authenticated but insufficient permissions |
| `404 Not Found` | Resource does not exist (also use to hide existence from unauthorized users) |
| `409 Conflict` | Resource state conflict (e.g., duplicate email, concurrent edit) |
| `422 Unprocessable Entity` | Syntactically valid but semantically invalid (business rule violation) |
| `429 Too Many Requests` | Rate limit exceeded. Include `Retry-After` header. |

### Server Error

| Code | When |
|---|---|
| `500 Internal Server Error` | Unhandled exception — always investigate |
| `502 Bad Gateway` | Upstream service returned invalid response |
| `503 Service Unavailable` | Planned maintenance or circuit breaker open. Include `Retry-After`. |
| `504 Gateway Timeout` | Upstream service timed out |

---

## Request/Response Envelope

### Successful Single Resource

```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "type": "invoice",
    "attributes": {
      "number": "INV-2026-0042",
      "amount": "15000.00",
      "currency": "INR",
      "status": "paid",
      "issued_at": "2026-03-15"
    }
  }
}
```

### Successful Collection

```json
{
  "data": [
    { "id": "...", "type": "invoice", "attributes": { ... } }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 142,
    "total_pages": 8
  },
  "links": {
    "self": "/api/v1/invoices?page=1&per_page=20",
    "next": "/api/v1/invoices?page=2&per_page=20",
    "prev": null,
    "first": "/api/v1/invoices?page=1&per_page=20",
    "last": "/api/v1/invoices?page=8&per_page=20"
  }
}
```

---

## Pagination

- Default page size: **20**
- Maximum page size: **100**
- Use **cursor-based** pagination by default for user-facing or high-scale APIs: `?cursor=eyJpZCI6MTAwfQ&limit=20`
- Use **offset-based** pagination only for backoffice, reporting, or low-scale admin UIs: `?page=2&per_page=20`
- Always return `meta` with total count (offset-based) or `has_more` (cursor-based).
- Always return `links` with navigation URLs.

---

## Error Format (RFC 7807)

All errors must follow [RFC 7807 Problem Details](https://www.rfc-editor.org/rfc/rfc7807):

```json
{
  "type": "https://api.company.com/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "The 'email' field must be a valid email address.",
  "instance": "/api/v1/users",
  "errors": [
    {
      "field": "email",
      "code": "invalid_format",
      "message": "Must be a valid email address."
    },
    {
      "field": "phone",
      "code": "required",
      "message": "This field is required."
    }
  ],
  "trace_id": "abc123def456"
}
```

- `type`: URI identifying the error type (can be a documentation URL).
- `title`: Short, human-readable summary.
- `status`: HTTP status code (must match the response status).
- `detail`: Human-readable explanation specific to this occurrence.
- `instance`: The request path.
- `errors`: Array of field-level errors (for validation failures).
- `trace_id`: Correlation ID for debugging.

---

## Versioning Policy

- Use **URL path versioning**: `/api/v1/`, `/api/v2/`
- Increment the major version only for **breaking changes**:
  - Removing a field from a response
  - Changing a field's type
  - Renaming a field
  - Changing the meaning of an existing field
  - Removing an endpoint
- **Non-breaking changes** (do not require version bump):
  - Adding new fields to responses
  - Adding new optional query parameters
  - Adding new endpoints
  - Adding new enum values to an existing field
- Support at most **2 active versions**. Deprecate old versions with a 6-month sunset window.
- Include `Deprecation` and `Sunset` headers on deprecated versions.
- Add contract tests for every public or cross-team API before deprecating old versions.

---

## Idempotency and Retries

- Any write endpoint that can be retried by clients, gateways, queues, or mobile apps must define idempotency behavior.
- Prefer `Idempotency-Key` for externally retried POST operations such as payments, submissions, and provisioning.
- Idempotency scope must include tenant and operation type.
- Replayed requests must return a stable result or an explicit conflict response.
- Async `202 Accepted` endpoints must expose a status resource or callback contract.

---

## Contract Governance

- Every API has an owner team.
- Every public or cross-team API must have:
  - OpenAPI source of truth
  - example requests and responses
  - contract tests
  - deprecation policy
  - changelog or release notes
- Additive changes are preferred over breaking changes.
- Any breaking change requires migration guidance for consumers.

---

## Authentication

- Use `Authorization: Bearer <token>` for all authenticated requests.
- Tokens are JWT (RS256) with the following claims: `sub` (user ID), `tenant_id`, `roles`, `exp`, `iat`.
- Token lifetime: 15 minutes for access tokens, 7 days for refresh tokens.
- Refresh tokens must be rotated on each use (one-time use).
- Service-to-service: use `X-Service-Auth` header with a pre-shared API key, scoped per service.

---

## Rate Limiting

- Rate limits are **per-tenant, per-endpoint-group**.
- Default limits: 100 requests/minute for write endpoints, 600 requests/minute for read endpoints.
- Include rate limit headers in every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1712400000
```

- When exceeded, return `429 Too Many Requests` with `Retry-After` header (seconds).

---

## CORS Policy

- Allow origins: configured per tenant (stored in tenant settings).
- Default allowed origins for internal apps: `https://*.saas.io`
- Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Allowed headers: `Content-Type, Authorization, X-Request-ID, X-Tenant-ID`
- Expose headers: `X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-Request-ID`
- Max age (preflight cache): `86400` (24 hours)
- Credentials: `true` (for cookie-based auth on web apps)

---

## Idempotency

- All `POST` endpoints that create resources or trigger actions must accept an `Idempotency-Key` header.
- The key is a client-generated UUID.
- The server stores the key → response mapping for 24 hours.
- If the same key is sent again within 24 hours, return the original response without re-executing.
- Return `409 Conflict` if the same key is used with different request bodies.

```
POST /api/v1/payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{"amount": "5000.00", "currency": "INR", "method": "upi"}
```

---

## Mandatory Headers

### Request

| Header | Required | Purpose |
|---|---|---|
| `Authorization` | Yes (except public endpoints) | Authentication |
| `Content-Type` | Yes (for request bodies) | Must be `application/json` |
| `Accept` | Recommended | Should be `application/json` |
| `X-Request-ID` | Recommended | Client-generated correlation ID (UUID) |
| `Idempotency-Key` | Required on POST | Idempotency |

### Response

| Header | Required | Purpose |
|---|---|---|
| `Content-Type` | Always | `application/json` |
| `X-Request-ID` | Always | Echo or generate correlation ID |
| `X-RateLimit-*` | Always | Rate limit status |
| `Cache-Control` | GET responses | Caching directive |
| `Location` | 201 responses | URL of created resource |
