# DynamoDB data model

The implementation uses seven separate, on-demand DynamoDB tables. IDs and GSI definitions are created in `infrastructure/template.yaml`; all GSIs used for record list responses project `ALL`. Data is region-local. There are no table scans in API handlers.

| Table | Primary key | Indexes | Access patterns / notes |
|---|---|---|---|
| `Users` | `userId` (Cognito `sub`) | `byTypeCreatedAt` (`recordType`, `createdAt`, keys-only projection) | Get/create verified profile on `GET /me`; admin profile count; holds the short-lived active seat booking lock (`activeBooking`, expiry). |
| `Complaints` | `complaintId` | `byOwnerCreatedAt` (`ownerId`, `createdAt`); `byTypeCreatedAt` (`recordType`, `createdAt`) | Students query own complaints; admin queries `recordType=COMPLAINT`; item includes status, location, priority, description, history. |
| `MessFeedback` | `feedbackId` | `byOwnerCreatedAt` (`ownerId`, `createdAt`); `byTypeCreatedAt` (`recordType`, `createdAt`) | A deterministic student/day/meal key enforces one rating per meal per Asia/Kolkata calendar day. Student and admin list queries. |
| `LibrarySeats` | `seatId` | `byType` (`recordType`) | One row per physical seat; `status` (`available`, `occupied`, `maintenance`), `zone`, `bookedBy`, `expiresAt`. Conditional reservation prevents overselling; only admins can change unbooked inventory status. |
| `SeatBookings` | `bookingId` | `byOwnerActive` (`ownerId`, `bookingId`) | Per-student lookup for active reservations and cancellation. `status` is `ACTIVE`/`CANCELLED`; booking expiry is two hours. |
| `Announcements` | `announcementId` | `byTypeCreatedAt` (`recordType`, `createdAt`) | Public-to-authenticated-campus list ordered newest first; all mutations are admin-only. |
| `ActivityLogs` | `id` | None | Append-only mutation breadcrumbs for issue, feedback, seat and announcement events. |

## Item conventions

- `recordType` is a fixed discriminator (`USER`, `COMPLAINT`, `FEEDBACK`, `SEAT`, `ANNOUNCEMENT`) used only on the relevant table's list index.
- Optional `demo: true` marks synthetic seed fixtures; API responses preserve the marker so the UI can label cloud datasets containing demonstration records. Real authenticated profiles are not created by the seed script.
- Timestamps are ISO-8601 UTC strings, sortable lexically by the time GSIs.
- Complaint items contain `ownerId`, `ownerName`, `location`, `room`, `category`, `priority`, `description`, `status`, `notes[]`, and `createdAt`.
- Feedback IDs use `<cognito-sub>#<YYYY-MM-DD-in-Asia/Kolkata>#<meal>`. Conditional `PutItem` rejects duplicate ratings.
- Seat reservation uses a transaction across `LibrarySeats`, `SeatBookings`, and `Users`. It conditions on the target seat being available (or an expired occupied row), and on the user's booking lock being absent or expired. Thus two requests cannot book one seat, and simultaneous attempts by one person cannot obtain two seats.
- GSI queries may return up to 100 records per request in this initial release. Pagination can be added with `LastEvaluatedKey` as records scale.

## Scale / cost posture

Tables use `PAY_PER_REQUEST` to avoid provisioned capacity and idle reservations; this does not guarantee zero charges. Assess current regional request/storage pricing and your account's applicable AWS Free Tier/credit terms before deployment. A low-traffic challenge demo should stay small, but API calls, data transfer, logs, and usage beyond account-specific allowances may be billed.
