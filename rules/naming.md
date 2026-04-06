# Rule: Naming Conventions

**Owner:** Engineering Leadership  
**Last Updated:** 2026-04-06  
**Applies To:** All code, databases, APIs, infrastructure

---

## Python

| Element | Convention | Example |
|---|---|---|
| Variables | `snake_case` | `user_count`, `nav_value`, `is_active` |
| Functions | `snake_case` | `calculate_returns()`, `get_tenant_config()` |
| Methods | `snake_case` | `def process_payment(self):` |
| Classes | `PascalCase` | `InvoiceService`, `TenantMiddleware` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| Modules / files | `snake_case` | `tenant_service.py`, `nav_calculator.py` |
| Packages / directories | `snake_case` | `fund_analytics/`, `user_management/` |
| Private members | `_leading_underscore` | `_internal_cache`, `_validate_input()` |
| Type variables | `PascalCase` or single uppercase | `T`, `KeyType`, `ReturnType` |
| Enums | `PascalCase` class, `UPPER_SNAKE_CASE` members | `class Status: ACTIVE = "active"` |

### Python-Specific Rules

- Boolean variables start with `is_`, `has_`, `can_`, `should_`: `is_active`, `has_permission`
- Collection variables use plural nouns: `users`, `invoices`, `nav_records`
- Functions that return booleans read as questions: `is_valid()`, `has_access()`, `can_process()`
- Avoid abbreviations except universally understood ones: `id`, `url`, `api`, `db`, `nav`
- Django model fields: `snake_case`, matching the database column name

---

## Kotlin

| Element | Convention | Example |
|---|---|---|
| Variables | `camelCase` | `userCount`, `navValue`, `isActive` |
| Functions | `camelCase` | `calculateReturns()`, `getTenantConfig()` |
| Classes | `PascalCase` | `InvoiceRepository`, `UserViewModel` |
| Interfaces | `PascalCase` (no `I` prefix) | `PaymentGateway`, `AuthProvider` |
| Constants | `UPPER_SNAKE_CASE` or `camelCase` in companion | `const val MAX_RETRIES = 3` |
| Packages | `lowercase`, dot-separated | `com.company.app.feature.dashboard` |
| Files | `PascalCase` (matching primary class) | `InvoiceRepository.kt` |
| Enum classes | `PascalCase` class, `UPPER_SNAKE_CASE` entries | `enum class Status { ACTIVE, INACTIVE }` |
| Type parameters | Single uppercase or descriptive | `T`, `K`, `V`, `Element` |
| Extension functions | `camelCase` | `fun String.toSlug(): String` |

### Kotlin-Specific Rules

- Backing properties use `_` prefix: `private val _items = MutableLiveData<List<Item>>()`, exposed as `val items: LiveData<List<Item>> = _items`
- Suspend functions indicate async nature in naming when not obvious: `fetchUserAsync()` is unnecessary (suspend already implies it), but `loadInitialData()` is clear
- Use expression body for single-expression functions: `fun isValid() = name.isNotBlank()`

---

## Swift

| Element | Convention | Example |
|---|---|---|
| Variables | `camelCase` | `userCount`, `navValue`, `isActive` |
| Functions | `camelCase` | `calculateReturns()`, `fetchPortfolio(for:)` |
| Classes / Structs | `PascalCase` | `InvoiceService`, `PortfolioView` |
| Protocols | `PascalCase` (adjective-like or `-able`/`-ible`) | `Cacheable`, `PaymentProcessing` |
| Constants | `camelCase` (instance), `UPPER_SNAKE_CASE` (global) | `let maxRetries = 3` |
| Enums | `PascalCase` type, `camelCase` cases | `enum Status { case active, inactive }` |
| Files | `PascalCase` (matching primary type) | `InvoiceService.swift` |
| Type aliases | `PascalCase` | `typealias CompletionHandler = (Result<Data, Error>) -> Void` |

### Swift-Specific Rules

- Use argument labels for clarity at call site: `move(from: a, to: b)` not `move(a, b)`
- Omit first argument label when it restates the function name: `contains(_ element:)` not `contains(element:)`
- Protocols describing capability use `-able`/`-ible`: `Equatable`, `Decodable`
- Protocols describing a role use a noun: `Collection`, `Delegate`

---

## TypeScript

| Element | Convention | Example |
|---|---|---|
| Variables | `camelCase` | `userCount`, `navValue`, `isActive` |
| Functions | `camelCase` | `calculateReturns()`, `getTenantConfig()` |
| Classes | `PascalCase` | `InvoiceService`, `UserController` |
| Interfaces | `PascalCase` (no `I` prefix) | `PaymentGateway`, `UserProfile` |
| Type aliases | `PascalCase` | `type ApiResponse<T> = { data: T; meta: Meta }` |
| Enums | `PascalCase` type, `PascalCase` members | `enum Status { Active, Inactive }` |
| Constants | `UPPER_SNAKE_CASE` for true constants, `camelCase` for derived | `const MAX_RETRIES = 3` |
| Files (components) | `PascalCase` | `InvoiceList.tsx`, `UserProfile.tsx` |
| Files (utilities) | `camelCase` | `formatCurrency.ts`, `apiClient.ts` |
| CSS classes | `kebab-case` or utility classes | `invoice-card`, `text-primary` |

### TypeScript-Specific Rules

- React components: `PascalCase` matching the file name
- Hooks: `camelCase` prefixed with `use`: `useAuth()`, `useTenant()`
- Event handlers: `handle` prefix: `handleClick()`, `handleSubmit()`
- Props interfaces: `ComponentNameProps`: `InvoiceListProps`, `UserCardProps`
- Generic type parameters: descriptive when not obvious: `TData`, `TError`, `TResponse`

---

## Go

| Element | Convention | Example |
|---|---|---|
| Exported (public) | `PascalCase` | `CalculateReturns()`, `UserService`, `MaxRetries` |
| Unexported (private) | `camelCase` | `calculateInternal()`, `userRepo`, `maxRetries` |
| Packages | `lowercase`, single word | `auth`, `invoice`, `tenant` |
| Files | `snake_case` | `user_service.go`, `invoice_handler.go` |
| Interfaces | `PascalCase`, `-er` suffix for single-method | `Reader`, `PaymentProcessor` |
| Constants | `PascalCase` (exported), `camelCase` (unexported) | `DefaultTimeout`, `maxBufferSize` |
| Acronyms | All caps when part of name | `HTTPClient`, `userID`, `parseJSON` |
| Test files | `*_test.go` | `user_service_test.go` |
| Mock types | `Mock` prefix | `MockUserRepository` |

### Go-Specific Rules

- Receivers: short (1-2 letter) abbreviation of the type: `func (s *Service) Process()`, `func (t *Tenant) Validate()`
- Error variables: `Err` prefix for sentinel errors: `ErrNotFound`, `ErrUnauthorized`
- Context parameter always first: `func Process(ctx context.Context, id string)`
- Avoid getters — use the field name directly: `user.Name()` not `user.GetName()`
- Package names should not stutter: `invoice.Service` not `invoice.InvoiceService`

---

## Database

| Element | Convention | Example |
|---|---|---|
| Tables | `snake_case`, **singular** | `user`, `invoice`, `nav_history` |
| Columns | `snake_case` | `first_name`, `created_at`, `tenant_id` |
| Primary key | `id` | `id UUID PRIMARY KEY` |
| Foreign keys | `{referenced_table}_id` | `tenant_id`, `user_id`, `invoice_id` |
| Indexes | `idx_{table}_{columns}` | `idx_invoice_tenant_id_issued_at` |
| Unique constraints | `uq_{table}_{columns}` | `uq_user_tenant_id_email` |
| Check constraints | `ck_{table}_{description}` | `ck_invoice_amount_positive` |
| Timestamps | `created_at`, `updated_at`, `deleted_at` | Always UTC, `TIMESTAMPTZ` type |
| Boolean columns | `is_`, `has_`, `can_` prefix | `is_active`, `has_verified_email` |
| Enum/status columns | Descriptive name, store as text | `status TEXT CHECK (status IN ('active', 'inactive'))` |
| Junction tables | `{table1}_{table2}` alphabetical | `role_user`, `fund_sector` |

### Database-Specific Rules

- Always use `TIMESTAMPTZ` (not `TIMESTAMP`) for time columns.
- Store monetary amounts as `DECIMAL(12, 2)` with explicit precision — never use `FLOAT`.
- Use `UUID` for primary keys, not auto-increment integers (prevents enumeration attacks, simplifies sharding).
- Soft delete: use `deleted_at TIMESTAMPTZ NULL`, not `is_deleted BOOLEAN`.

---

## API Endpoints

| Convention | Example |
|---|---|
| Plural resources, kebab-case | `/api/v1/investment-funds`, `/api/v1/nav-histories` |
| Resource identifier | `/api/v1/users/{user_id}` |
| Nested resources (max 2 levels) | `/api/v1/tenants/{tenant_id}/users` |
| Actions (non-CRUD) | `/api/v1/orders/{order_id}/cancel` |
| Search/filter | `/api/v1/funds?category=equity&min_aum=1000` |
| Query parameters | `snake_case`: `?page_size=20&sort_by=created_at` |

---

## File Naming Summary

| Language | Convention | Example |
|---|---|---|
| Python | `snake_case.py` | `tenant_service.py` |
| Kotlin | `PascalCase.kt` | `InvoiceRepository.kt` |
| Swift | `PascalCase.swift` | `PortfolioViewModel.swift` |
| TypeScript (component) | `PascalCase.tsx` | `InvoiceList.tsx` |
| TypeScript (utility) | `camelCase.ts` | `formatCurrency.ts` |
| Go | `snake_case.go` | `user_handler.go` |
| SQL migrations | `NNNN_description.sql` | `0042_add_tenant_billing.sql` |
| Config files | `kebab-case.yaml` | `brand-config.yaml` |
| Shell scripts | `kebab-case.sh` | `setup-dns.sh` |
| Markdown | `kebab-case.md` | `api-design.md` |

---

## Anti-Patterns

- `data`, `info`, `stuff` — too vague. Be specific: `user_profile`, `transaction_detail`
- `temp`, `tmp`, `foo`, `bar` — never in production code
- `manager`, `handler`, `processor` — acceptable only if the class genuinely manages/handles/processes. Avoid as catch-all suffixes.
- Single-letter variables — only acceptable for loop indices (`i`, `j`), receivers in Go (`s`, `t`), and well-scoped lambdas
- Hungarian notation (`strName`, `intCount`) — never
- Negated booleans (`is_not_active`, `disable_logging`) — use positive naming and negate at usage
