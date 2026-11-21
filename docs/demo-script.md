# 60–90 second CampusConnect demo script

**Target length:** about 75 seconds. Screen-record the deployed HTTPS app only after production verification. If showing local mode, say “local demo mode” clearly and never narrate it as cloud persistence. Use an authorized admin account and fictional data.

| Time | Screen / action | Voiceover |
|---|---|---|
| 0–8s | Landing page; point to the toolkit | “CampusConnect brings everyday campus services into one place. Students currently chase Wi-Fi support, mess feedback, library seats and campus notices across different channels.” |
| 8–17s | Sign in as a demo student using Cognito; show dashboard | “A student signs in securely and gets a clear snapshot of open requests, recent notices, mess ratings and seats available.” |
| 17–29s | Open Wi-Fi complaints; create a concise issue in a fictional room; submit and open its details | “Here I report unstable hostel Wi-Fi. The request is validated, linked to my authenticated identity and tracked through campus support.” |
| 29–38s | Library; reserve an available seat; show the updated reserved state / expiry | “Library availability is interactive. This seat reservation is stored through a transactional backend, so a concurrent booking cannot take the same seat.” |
| 38–47s | Mess feedback; select a meal, rate, submit | “Students can rate a specific meal once per day and share a short note; duplicate ratings are rejected server-side.” |
| 47–61s | Sign out / sign in as pre-authorized campus admin; show complaints and change status / add resolution note | “Authorized administrators see campus-wide requests and can move an issue through its resolution history. Admin rights are verified from Cognito groups by the API—not just the interface.” |
| 61–71s | Analytics and notices | “The admin view summarizes service activity, meal ratings and library occupancy, and administrators can publish categorized updates.” |
| 71–82s | Brief architecture graphic / AWS console show only deployed resources | “The live architecture uses Cognito, API Gateway HTTP API, TypeScript Lambda and DynamoDB with least-privilege table access. The seat write is transactional. The deployed URL and cloud persistence were verified for this recording.” |

**Capture checklist:** show URL bar and secure origin, keep real student names/emails hidden, use a fabricated identity, do not expose AWS account IDs or console secrets, no unverified claims. If no deployment exists, replace the last line with “This is the local demo; the AWS deployment is prepared in SAM but not yet provisioned,” and do not call it AWS-powered in that recording.
