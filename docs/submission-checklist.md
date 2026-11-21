# Presentation outline + challenge submission checklist

## Concise 5-slide presentation

1. **Campus pain point** — Fragmented Wi-Fi complaints, unstructured mess feedback, uncertain library seats, missed notices. State who experiences the problem.
2. **CampusConnect** — One Campus. One Platform. Smarter Solutions. Show student dashboard and four core workflows.
3. **How it works** — Student workflow: authenticated report → tracked status → resolution; meal rating; atomic two-hour library booking; campus announcement.
4. **AWS architecture + safeguards** — Cognito JWT/groups → API Gateway HTTP API → TypeScript Lambda → seven DynamoDB tables. Show server-side authorization, owner-scoped access and transaction/conditional booking. State what is not implemented (S3/SNS) rather than imply it is.
5. **Impact, proof and next steps** — Show only measured test results, verified public URL (if deployed), short demo QR/URL, cost guardrails, future extensions (attachments, verified notifications, privacy retention review).

## Submission verification

### Product
- [ ] Landing, sign-in/registration, student dashboard, complaint workflow, mess rating, library booking/cancel/expiry, announcements, profile, admin dashboard/analytics, 404 checked at phone + desktop widths.
- [ ] Every visible control has an action. Empty/error/success/loading states reviewed. Keyboard focus and labels checked.
- [ ] Local demo clearly marked as browser-only; production capture uses actual Cognito and AWS API.
- [ ] Seat booking race: two separate users attempt one seat; one succeeds, other receives 409. Test same student trying multiple seats.
- [ ] Duplicate per-day meal rating rejected. Student cannot read/update another student's private complaint. Student cannot call admin API. Missing/invalid token rejected.

### AWS / security / cost
- [ ] AWS pricing, Free Tier account plan, region support, Amplify usage and data-transfer reviewed on deployment day.
- [ ] Account owner approved SAM change set; no NAT / EC2 / unplanned services; budget email alert configured.
- [ ] `admins` group contains only verified authorized operators. No credentials committed, frontend bundle, screenshots, or video.
- [ ] CORS is exact production origin; HTTPS; API output + Cognito app client configured; real data survives reload.
- [ ] No production URL/resource is stated until verified. Clean up demo resources after the challenge if no longer needed.

### Repository / evidence
- [ ] Rename folder/repo to `CampusConnect-AWS-ShipIt-2026`; `.gitignore`, README, docs, SAM template and tests included.
- [ ] `npm run build`, `npm test`, `npm run lint`, `sam validate --lint` executed; report exact outcome.
- [ ] Screenshots are current and generated from actual app; redact personal data; label local vs cloud.
- [ ] Git commits are meaningful; GitHub push only claimed after push succeeds.
- [ ] 60–90s demo recorded with honest cloud/local narration and no secrets.
- [ ] Submission has project description, verified project URL (or explicitly “not deployed”), architecture, demo link and contact details.

## Suggested commit sequence

1. `chore: scaffold CampusConnect React and SAM workspaces`
2. `feat: build responsive student and campus admin workflows`
3. `feat: add Cognito JWT API and DynamoDB transactional services`
4. `test: cover authorization validation and booking conflicts`
5. `docs: add AWS deployment cost and demo runbooks`
