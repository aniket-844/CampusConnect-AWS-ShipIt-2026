# Testing and verification report

**Run date:** 21 Nov 2026 (workspace local time)
**Scope:** local source, TypeScript build, mocked Lambda handler tests, and browser-storage UI tests. 
**Not performed:** AWS deployment / production integration, actual Cognito identities, live DynamoDB transactions, SAM transform validation (SAM CLI not installed), or full real-browser/manual accessibility run.

## Executed commands and results

| Check | Result | Evidence / boundary |
|---|---|---|
| `npm run build` | **PASS** | Vite 8.3.8 production build and backend TypeScript compile completed. Admin charts are lazy-loaded / split; Recharts package chunk is 386.81 KB uncompressed / 105.32 KB gzip. |
| `npm test` | **PASS — 25 tests** | Backend Vitest: 18 tests; frontend Vitest: 7 tests. Outputs recorded in workspace. |
| `npm run lint` | **PASS** | Strict TypeScript checks for frontend and backend completed. This script is type-checking, not ESLint. |
| `npm audit --audit-level=moderate` | **PASS — 0 reported vulnerabilities** | Package audit ran after dependency updates. Re-run before submission/deploy as advisories change. |
| Python YAML parse of `infrastructure/template.yaml` | **PASS — syntax only** | Parsed 13 CloudFormation/SAM resources using a YAML loader that accepts intrinsic tags. Does not validate SAM schema, transforms, IAM semantics or deployment. |
| Python YAML parse of `infrastructure/budget-alert.yaml` | **PASS — syntax only** | Parsed the optional one-resource budget template; no AWS budget was created. |
| `sam validate --lint` | **NOT RUN** | AWS SAM CLI is unavailable in this environment. Run after installing SAM CLI before deploy. |
| AWS CLI / caller identity | **NOT RUN** | AWS CLI is unavailable; no AWS credentials or connected cloud account were supplied. |
| Local Vite preview | **PASS, HTTP smoke check** | Server started on port 5173; landing HTML and transformed `App.tsx` / lazy admin module returned HTTP 200. This is not browser automation. |
| AWS / deployed URL / persistence | **PENDING** | No cloud resources or URL created; cannot claim production auth, persistence, CORS, cost, or actual concurrency behavior verified. |

## Test coverage

### Backend (18 tests; DynamoDB SDK mocked)

- Missing JWT identity → 401.
- Malformed JSON / invalid description / invalid status → validation errors.
- Student cannot update complaint status or publish announcements.
- Student complaint `ownerId` is derived from JWT, not payload.
- Student complaint list uses owner partition key; admin profile count uses a paginated GSI query, not a table scan.
- Duplicate feedback conditional failure → 409.
- Student feedback response omits student ID and feedback key.
- Admin assignment writes validated assignee field.
- Student cannot change seat inventory; admin can mark an unbooked seat for maintenance.
- Transactional seat conflict is mapped to 409.

**Boundary:** these tests exercise handler branches with mocked DynamoDB commands. They do not validate actual IAM policy evaluation, API Gateway JWT behavior, Cognito group claims, or DynamoDB transaction semantics in a deployed account.

### Frontend (7 tests)

- Local demo seed / localStorage persistence / complaint ownership / rating value.
- Student sign-in and Wi-Fi report submission persists to browser store.
- Mess rating is submitted and same-day duplicate UI is blocked.
- Student deep link to administrator complaint page displays access denial.

**Boundary:** local demo auth is intentionally not real authentication. The tests do not cover AWS network requests; deployed API authorization is separately required.

## Required pre-submission / production checks

1. Install SAM + AWS CLI; run `sam validate --lint` and inspect generated change set.
2. Review region support, account-specific Free Tier credits/allowances, Amplify/API/DynamoDB/Lambda/Cognito/CloudWatch/data-transfer prices and budget alerts.
3. Deploy only with account-owner approval; verify no unexpected resources.
4. Create real verified student and admin Cognito users; verify admin group enforcement server-side.
5. Verify owner isolation, invalid / missing tokens, duplicate meal submission, real DynamoDB persistence, announcement CRUD and two-user seat booking/cancellation under concurrent requests.
6. Check CORS on the exact Amplify domain, desktop/mobile UI, keyboard and screen-reader basics, error/loading states, log retention, and a clean resource teardown.
7. Capture/redact real screenshots and record a demo only after the matching app environment is verified.
