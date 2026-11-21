# REST API

Base URL is the `ApiBaseUrl` stack output. Every route requires a Cognito JWT in `Authorization: Bearer <token>`. API Gateway verifies issuer and app-client audience. JSON request/response bodies. IDs and ownership are never trusted from student request bodies.

| Method | Path | Authorization | Behavior |
|---|---|---|---|
| GET | `/me` | Any signed-in user | Get/create user profile, role from Cognito `admins` group. |
| GET | `/dashboard` | Any signed-in user | Aggregate counts for caller; admin gets campus request totals and exact registered profile count via a paginated Users GSI count query. |
| GET | `/complaints` | Student: own records; admin: all | Query by owner or complaint discriminator GSI. |
| POST | `/complaints` | Student or admin | Create complaint. Required location/room/category, description ≥12 chars; priority Low/Medium/High. Owner comes from JWT. |
| PATCH | `/complaints/{id}` | Admin group only | Update status (`Submitted`, `In Progress`, `Resolved`, `Rejected`), optionally assign a campus/team name, and/or append a resolution note. |
| GET | `/feedback` | Campus feed (anonymous); admin: all including owner claims | Query recent campus feedback. Student responses omit student IDs and use an `isMine` marker so ratings/feedback are visible without disclosing owner identifiers. |
| POST | `/feedback` | Signed-in user | Submit meal and integer rating 1–5. One rating per meal/student/Asia/Kolkata calendar day; duplicate returns 409. |
| GET | `/seats` | Signed-in user | List library seat inventory; expired rows are presented as available. |
| PATCH | `/seats/{seatId}` | Admin group only | Mark a seat `available` or `maintenance`. Active reservations cannot be overridden. |
| PUT | `/seats/{seatId}/booking` | Signed-in user | Reserve for two hours. Transactional; conflicts / double booking return 409. |
| DELETE | `/seats/{seatId}/booking` | Booking owner | Cancel caller's active reservation. |
| GET | `/announcements` | Signed-in user | List campus notices. |
| POST | `/announcements` | Admin group only | Publish title, body, category, priority. |
| PATCH | `/announcements/{id}` | Admin group only | Update announcement fields. |
| DELETE | `/announcements/{id}` | Admin group only | Delete announcement. |

Errors are JSON `{ "message": "..." }`; usual statuses: 400 validation, 401 missing/invalid token (API Gateway), 403 admin-only operation, 404 missing route/item, 409 duplicate/concurrent conflict, 500 generic internal error, 503 missing deployed table. Never return secrets or raw DynamoDB error details.

Example complaint:
```json
{"location":"Hostel 7","room":"B-214","category":"Slow speed","priority":"Medium","description":"Wi-Fi speed drops after 8 PM in the east wing."}
```

Example rating:
```json
{"meal":"Lunch","rating":4,"comment":"Fresh rotis and a good dal today."}
```
