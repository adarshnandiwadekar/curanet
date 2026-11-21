# CuraNet Resource Catalogue

React / Express / tRPC / Drizzle starter, adapted from the Sandbox web-db-user template.

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.

## Live operations deployment

The static Netlify build publishes the public shell only. Live tRPC procedures, Manus OAuth callbacks, Drizzle/MySQL access, and SMTP delivery must run from the server-capable container produced by `pnpm build` and `pnpm start`. Configure the frontend's API origin and cross-site session policy on the chosen host; do not expose the server runtime secrets to Netlify's browser bundle.

The server reads SMTP configuration only at runtime: `SMTP_HOST`, `SMTP_PORT` (default `587`), `SMTP_SECURE` (`true` for implicit TLS, or STARTTLS otherwise), `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and an HTTPS `LIVE_COORDINATOR_DASHBOARD_URL` (or `PUBLIC_APP_URL`). Store these as protected server secrets. Coordinator routing requires `role=coordinator`, `partnerVerified=true`, a non-empty email, and the submitted enquiry's region in the coordinator's comma-separated `partnerRegions` value.

Apply only the checked-in additive migration with `pnpm db:migrate` after inspecting the managed schema. This repository intentionally does not contain a database URL, SMTP credential, or production API origin.
