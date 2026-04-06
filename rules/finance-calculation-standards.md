# Rule: Finance Calculation Standards

**Owner:** Fintech Engineering  
**Last Updated:** 2026-04-06  
**Applies To:** All code performing financial calculations (backend, mobile, analytics)

---

## Decimal Precision

### Mandatory: Use Decimal, Never Float

Floating-point arithmetic (`float`, `double`) introduces rounding errors that compound in financial calculations. This is non-negotiable.

```python
# WRONG — float accumulates errors
price = 0.1 + 0.2  # = 0.30000000000000004

# CORRECT — Decimal is exact
from decimal import Decimal
price = Decimal("0.1") + Decimal("0.2")  # = Decimal("0.3")
```

### Precision Requirements by Domain

| Domain | Precision | Storage Type |
|---|---|---|
| NAV (Net Asset Value) | 4 decimal places | `DECIMAL(16, 4)` |
| Unit balance | 4 decimal places (minimum) | `DECIMAL(18, 4)` |
| Transaction amount | 2 decimal places | `DECIMAL(14, 2)` |
| Expense ratio / TER | 4 decimal places (as percentage) | `DECIMAL(6, 4)` |
| Return percentage | 4 decimal places | `DECIMAL(8, 4)` |
| Exchange rate | 6 decimal places | `DECIMAL(12, 6)` |
| Tax amount | 2 decimal places | `DECIMAL(14, 2)` |
| Interest rate | 4 decimal places (as percentage) | `DECIMAL(6, 4)` |

### Language-Specific Implementations

**Python:**

```python
from decimal import Decimal, ROUND_HALF_EVEN, getcontext

getcontext().prec = 28
getcontext().rounding = ROUND_HALF_EVEN

nav = Decimal("87.4523")
units = Decimal("1234.5678")
value = (nav * units).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
```

**Kotlin:**

```kotlin
import java.math.BigDecimal
import java.math.RoundingMode

val nav = BigDecimal("87.4523")
val units = BigDecimal("1234.5678")
val value = nav.multiply(units).setScale(2, RoundingMode.HALF_EVEN)
```

**TypeScript:**

```typescript
import Decimal from 'decimal.js';

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_EVEN });

const nav = new Decimal('87.4523');
const units = new Decimal('1234.5678');
const value = nav.times(units).toDecimalPlaces(2);
```

**Go:**

```go
import "github.com/shopspring/decimal"

nav := decimal.NewFromString("87.4523")
units := decimal.NewFromString("1234.5678")
value := nav.Mul(units).Round(2)
```

---

## Rounding Rules

### Default: Half-Even (Banker's Rounding)

All financial calculations use **half-even rounding** (IEEE 754) unless a regulatory or contractual requirement specifies otherwise.

Half-even rounding rounds to the nearest even number when the value is exactly at the midpoint:

| Value | Rounded (half-even) | Rounded (half-up) |
|---|---|---|
| 2.5 | 2 | 3 |
| 3.5 | 4 | 4 |
| 4.5 | 4 | 5 |
| 5.5 | 6 | 6 |
| 2.55 (to 1 dp) | 2.6 | 2.6 |
| 2.45 (to 1 dp) | 2.4 | 2.5 |

### Rounding by Operation

| Operation | Rounding | Precision |
|---|---|---|
| NAV computation | Half-even | 4 decimal places |
| Unit allocation (purchase) | **Truncation** (floor) | 4 decimal places |
| Redemption amount | **Truncation** (floor) | 2 decimal places |
| Tax calculation | Half-up (per tax authority) | 2 decimal places |
| Fee calculation | Half-even | 2 decimal places |
| Return display (%) | Half-even | 2 decimal places |
| Foreign exchange conversion | Half-even | 2 decimal places |

### Implementation

```python
from decimal import Decimal, ROUND_HALF_EVEN, ROUND_DOWN, ROUND_HALF_UP

def allocate_units(amount: Decimal, nav: Decimal) -> Decimal:
    """Purchase: truncate units to avoid over-allocation."""
    return (amount / nav).quantize(Decimal("0.0001"), rounding=ROUND_DOWN)

def calculate_redemption_amount(units: Decimal, nav: Decimal) -> Decimal:
    """Redemption: truncate amount to avoid over-payment."""
    return (units * nav).quantize(Decimal("0.01"), rounding=ROUND_DOWN)

def calculate_tax(amount: Decimal, rate: Decimal) -> Decimal:
    """Tax: half-up as per Indian tax authority convention."""
    return (amount * rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def calculate_fee(amount: Decimal, fee_pct: Decimal) -> Decimal:
    """Fees: half-even (banker's rounding)."""
    return (amount * fee_pct / Decimal("100")).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
```

---

## Date Conventions

### Day Count Conventions

| Convention | Formula | When Used |
|---|---|---|
| **Actual/365** | actual days / 365 | Common for regulated fund returns in some jurisdictions |
| **Actual/Actual** | actual days / actual days in year | Bond yield (some markets) |
| **30/360** | (360×(Y2-Y1) + 30×(M2-M1) + (D2-D1)) / 360 | US corporate bonds, some loan calculations |
| **Actual/360** | actual days / 360 | Money market instruments |

### Default Convention

All return calculations use **Actual/365** unless explicitly specified otherwise.

```python
from datetime import date
from decimal import Decimal


def year_fraction_actual_365(start: date, end: date) -> Decimal:
    days = (end - start).days
    return Decimal(days) / Decimal(365)


def year_fraction_30_360(start: date, end: date) -> Decimal:
    d1 = min(start.day, 30)
    d2 = min(end.day, 30) if d1 == 30 else end.day
    days = 360 * (end.year - start.year) + 30 * (end.month - start.month) + (d2 - d1)
    return Decimal(days) / Decimal(360)
```

### Business Day Rules

- NAV is published on business days only (excluding market holidays and weekends).
- For SIP transactions falling on holidays, use the next business day.
- Redemption settlement: T+2 business days (equity), T+1 (liquid/overnight).
- Maintain a holiday calendar per market (NSE, BSE).

---

## Currency Handling

### ISO 4217 Compliance

- Always store and transmit currency codes as 3-letter ISO 4217 codes: `INR`, `USD`, `EUR`, `GBP`.
- Store monetary amounts with their currency code — never assume a default currency.

### Minor Units (Smallest Currency Unit)

| Currency | Code | Minor Units | Factor |
|---|---|---|---|
| Indian Rupee | INR | Paise | 100 |
| US Dollar | USD | Cents | 100 |
| Japanese Yen | JPY | — | 1 |
| Kuwaiti Dinar | KWD | Fils | 1000 |

### Storage and Transmission

For APIs and inter-service communication, store amounts as strings to preserve precision:

```json
{
  "amount": "15000.50",
  "currency": "INR"
}
```

Never transmit monetary values as JSON numbers (risk of floating-point loss).

### Money Type

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Money:
    amount: Decimal
    currency: str

    def __post_init__(self):
        if not isinstance(self.amount, Decimal):
            raise TypeError("amount must be Decimal")
        if len(self.currency) != 3:
            raise ValueError("currency must be ISO 4217 code")

    def __add__(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError(f"Cannot add {self.currency} and {other.currency}")
        return Money(amount=self.amount + other.amount, currency=self.currency)

    def __mul__(self, factor: Decimal) -> 'Money':
        return Money(amount=self.amount * factor, currency=self.currency)

    def quantize(self, places: int = 2) -> 'Money':
        exp = Decimal(10) ** -places
        return Money(
            amount=self.amount.quantize(exp, rounding=ROUND_HALF_EVEN),
            currency=self.currency,
        )
```

---

## NAV Calculation Timing

- **Cut-off time:** 3:00 PM IST for equity funds, 1:30 PM IST for liquid/debt funds.
- **NAV applicability:**
  - Purchase before cut-off → same day's NAV
  - Purchase after cut-off → next business day's NAV
  - Redemption before cut-off → same day's NAV
- **NAV publication:** By 11:00 PM IST on the same business day (SEBI mandate).
- **System behavior:** If NAV is not yet published, queue the transaction and process when NAV is available. Never use stale NAV for transaction processing.

```python
from datetime import datetime, time
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
EQUITY_CUTOFF = time(15, 0)
DEBT_CUTOFF = time(13, 30)


def get_applicable_nav_date(order_time: datetime, fund_type: str) -> date:
    ist_time = order_time.astimezone(IST)
    cutoff = EQUITY_CUTOFF if fund_type == "equity" else DEBT_CUTOFF

    if ist_time.time() <= cutoff and is_business_day(ist_time.date()):
        return ist_time.date()
    else:
        return next_business_day(ist_time.date())
```

---

## Return Calculation Methods

### Point-to-Point (Absolute) Return

```
Return = (NAV_end - NAV_start) / NAV_start
```

Use for: displaying returns for a specific period (1M, 3M, 6M, YTD).

### CAGR (Compound Annual Growth Rate)

```
CAGR = (NAV_end / NAV_start) ^ (365 / days) - 1
```

Use for: annualized returns for periods ≥ 1 year. **Never annualize periods under 1 year.**

### XIRR (Extended Internal Rate of Return)

Use for: SIP returns, any scenario with multiple cash flows at irregular intervals.

```python
from scipy.optimize import brentq
from decimal import Decimal
from datetime import date


def xirr(cashflows: list[tuple[date, Decimal]], guess: float = 0.1) -> float:
    """
    cashflows: list of (date, amount) tuples.
    Negative amounts = investments, positive amounts = redemptions/current value.
    """
    dates = [cf[0] for cf in cashflows]
    amounts = [float(cf[1]) for cf in cashflows]
    min_date = min(dates)

    def npv(rate):
        return sum(
            amount / (1 + rate) ** ((d - min_date).days / 365.0)
            for d, amount in zip(dates, amounts)
        )

    return brentq(npv, -0.999, 10.0)


# Example:
# SIP of ₹10,000/month for 12 months, current value ₹1,32,500
# cashflows = [
#     (date(2025, 5, 1), Decimal("-10000")),
#     (date(2025, 6, 1), Decimal("-10000")),
#     ...
#     (date(2026, 4, 1), Decimal("-10000")),
#     (date(2026, 4, 6), Decimal("132500")),   # current value
# ]
# XIRR ≈ 18.4%
```

### Time-Weighted Return (TWR)

Use for: evaluating fund manager performance independent of cash flow timing.

```python
def time_weighted_return(sub_period_returns: list[Decimal]) -> Decimal:
    """
    sub_period_returns: list of returns for each sub-period
    between cash flow events, as decimals (e.g., 0.05 for 5%).
    """
    product = Decimal("1")
    for r in sub_period_returns:
        product *= (Decimal("1") + r)
    return product - Decimal("1")
```

### Money-Weighted Return (MWR)

Use for: evaluating investor's actual experience including timing of cash flows. Equivalent to XIRR.

---

## Annualization Rules

| Period | Annualize? | Method |
|---|---|---|
| < 1 year | **No** — show absolute return only | — |
| 1 year | Show as-is (already annual) | — |
| > 1 year | **Yes** — use CAGR | `(end/start)^(365/days) - 1` |
| Rolling returns | Yes, always annualized | CAGR per window |

**Display formatting:**

- Periods < 1 year: "12.5% (6 months)" — label the period explicitly
- Periods ≥ 1 year: "15.3% p.a." — indicate annualized

---

## Benchmark Comparison Methodology

### Rules

- Always compare against the **declared benchmark** of the fund (per SEBI requirement).
- Additionally show comparison against the **category benchmark** (e.g., Nifty 50 TRI for large cap).
- Use **Total Return Index (TRI)**, not Price Return Index (PRI). TRI includes dividends.
- Align date ranges exactly — compare same start and end dates.
- For rolling return comparisons, use the same rolling window size for both fund and benchmark.

### Alpha Calculation

```python
def calculate_alpha(fund_return: Decimal, benchmark_return: Decimal) -> Decimal:
    """Simple alpha = fund return - benchmark return."""
    return fund_return - benchmark_return


def calculate_jensens_alpha(
    fund_return: Decimal,
    benchmark_return: Decimal,
    risk_free_rate: Decimal,
    beta: Decimal,
) -> Decimal:
    """Jensen's Alpha = R_fund - [R_f + β × (R_m - R_f)]"""
    expected = risk_free_rate + beta * (benchmark_return - risk_free_rate)
    return fund_return - expected
```

---

## Validation Rules

Every financial calculation must be validated before storage or display:

```python
def validate_nav(nav: Decimal) -> None:
    if nav <= 0:
        raise ValueError(f"NAV must be positive, got {nav}")
    if nav > Decimal("100000"):
        raise ValueError(f"NAV suspiciously high: {nav}")

def validate_return(return_pct: Decimal, period_years: Decimal) -> None:
    max_reasonable = Decimal("200") if period_years <= 1 else Decimal("100")
    if abs(return_pct) > max_reasonable:
        raise ValueError(f"Return {return_pct}% over {period_years}Y exceeds reasonable bounds")

def validate_expense_ratio(ter: Decimal) -> None:
    if ter < 0:
        raise ValueError("Expense ratio cannot be negative")
    if ter > Decimal("3"):
        raise ValueError(f"Expense ratio {ter}% exceeds SEBI maximum")
```

---

## Audit Trail for Calculations

Every financial calculation that results in a monetary transaction must log:

1. Input values (with precision)
2. Formula applied
3. Intermediate results
4. Final result
5. Rounding applied
6. Timestamp and system version

```python
import logging

calc_logger = logging.getLogger("calculations.audit")

def purchase_units(amount: Decimal, nav: Decimal, tenant_id: str) -> Decimal:
    raw_units = amount / nav
    allocated_units = raw_units.quantize(Decimal("0.0001"), rounding=ROUND_DOWN)

    calc_logger.info(
        "Unit allocation",
        extra={
            "audit": True,
            "tenant_id": tenant_id,
            "calculation": "purchase_units",
            "inputs": {"amount": str(amount), "nav": str(nav)},
            "raw_result": str(raw_units),
            "rounding": "ROUND_DOWN",
            "precision": "0.0001",
            "final_result": str(allocated_units),
        },
    )

    return allocated_units
```
