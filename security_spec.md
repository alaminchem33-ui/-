# Security Specification: Mess Meal & Bazar Manager

## 1. Data Invariants
1. **Authentication & Verification Gate**: Every read and write operation requires `request.auth != null` and `request.auth.token.email_verified == true`.
2. **Ownership & Identity Integrity**: Every `MessLedger`, `LedgerMember`, and `BazarDay` document carries an immutable `ownerId` strictly matching `request.auth.uid`.
3. **Master Gate Relational Sync**: Every subcollection document under `/ledgers/{ledgerId}/members/{memberId}` and `/ledgers/{ledgerId}/bazarDays/{dayId}` verifies ownership against the parent `/ledgers/{ledgerId}` document via `get()` / `getAfter()`.
4. **Strict Key Allowlisting & Type/Range Bounds**:
   - No ghost/shadow fields permitted on `create` (`hasAll` + `hasOnly`) or `update` (`affectedKeys().hasOnly(...)`).
   - All document IDs validated by `^[a-zA-Z0-9_\-]+$` and bounded to `<= 128` chars.
   - Numeric invariants: `deposit >= 0`, `mealQty >= 0`, `feastCost >= 0`, `cost >= 0`, `globalFeastTotal >= 0`, `daysCount >= 28 && daysCount <= 31`, `day >= 1 && day <= 31`.
   - `dailyMeals` bounded to `size() <= 31` with first-element numeric type guard when non-empty.
5. **Temporal Integrity**: `createdAt == request.time` on creation (and immutable thereafter); `updatedAt == request.time` on creation and every update.

## 2. The "Dirty Dozen" Attack Payloads (All Must Return PERMISSION_DENIED)
1. **Unauthenticated Read**: `get(/ledgers/nov-2026)` with `auth == null`.
2. **Unverified Email Write**: `create(/ledgers/nov-2026)` with `auth.token.email_verified == false`.
3. **Identity Spoofing on Create**: `create(/ledgers/nov-2026)` with `ownerId: "victim-uid"`.
4. **Shadow Field Injection on Create**: `create(/ledgers/nov-2026)` including extra field `isAdmin: true`.
5. **Shadow Field Injection on Update**: `update(/ledgers/nov-2026)` modifying `monthEn` plus ghost key `role: "superadmin"`.
6. **Immutable Field Tampering**: `update(/ledgers/nov-2026)` attempting to mutate `ownerId` or `createdAt`.
7. **ID Poisoning**: `create(/ledgers/<1500-char-id>)` or `create(/ledgers/bad$id)`.
8. **Invalid Enum Value**: `update(/ledgers/nov-2026)` with `chefRule: "arbitrary"`.
9. **Negative Deposit / Bazar Cost**: `create(/ledgers/nov-2026/bazarDays/day-01)` with `cost: -500`.
10. **Unbounded Array / Type Poisoning**: `update(/ledgers/nov-2026/members/m1)` with `dailyMeals` of length `40` or `dailyMeals: ["bad"]`.
11. **Timestamp Forgery**: `update(/ledgers/nov-2026)` with client-supplied past `updatedAt` instead of `request.time`.
12. **Blanket List Query Scraping**: `list(/ledgers)` without a `where('ownerId', '==', auth.uid)` filter matching `resource.data.ownerId`.
