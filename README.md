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

## Accessibility controls: patient and provider guide

The public CuraNet shell includes two controls in the **Senior-friendly view** bar: **Larger text** and **Higher contrast**. They are available on the catalogue, directory, request, and Live-mode pages, and the selected state is shown by the button's active styling and pressed state.

### For patients, families, and visitors

1. Open [curanett.netlify.app](https://curanett.netlify.app) and find the Senior-friendly view bar below the header.
2. Select **Larger text** to increase the base text size across headings, descriptions, labels, buttons, forms, metadata, and dialogs. Select it again to return to the standard size.
3. Select **Higher contrast** to use darker text, clearer borders, stronger controls, and more visible focus indicators. Select it again to return to the standard colour treatment.
4. You can use both controls together. The choices are remembered in this browser on this device; clearing site data or switching browsers resets them.
5. Keyboard users can reach both controls with `Tab`, activate them with `Enter` or `Space`, and see the current state from the visible active styling and `aria-pressed` state. Browser zoom and operating-system accessibility settings can be used in addition to these controls.

CuraNet's public catalogue and Demo records are informational. The accessibility controls do not change enquiry eligibility, inventory, allocation, medical advice, or contact any organisation.

### For NGO and CSR providers

Providers use the same controls while reviewing the public catalogue or explaining the request flow to a patient or family. For an authenticated coordinator dashboard, the larger-text preference also scales dashboard headings, enquiry details, filters, status controls, export actions, and modal content; higher contrast strengthens dashboard cards, form controls, borders, status chips, and focus rings. Preferences are local to the browser and are not shared with other users or devices.

Accessibility settings do not expand Live permissions. A provider must still use an authenticated, verified coordinator account, and the server continues to enforce role and partner-region authorization for enquiries, status updates, and exports.

### Automated production audit

Lighthouse was run against [https://curanett.netlify.app](https://curanett.netlify.app) after deployment. The final scores were **Accessibility 100/100**, **Best Practices 100/100**, **Performance 79/100**, and **SEO 91/100**. No actionable accessibility audits remained. The audit also confirmed that browser zoom is permitted; the earlier restrictive `maximum-scale=1` viewport and low-contrast muted/accent text were corrected.

## Current Live operations status

Completed in the repository: additive/repeat-safe migration SQL and journal metadata, server-side regional authorization, post-commit notification routing, protected CSV/PDF export helpers, and the public accessibility controls. The static frontend is deployed at [curanett.netlify.app](https://curanett.netlify.app).

Still pending before claiming Live production readiness: attach a server-capable production host, configure the production API origin and OAuth callback/cookie policy, provide a protected managed `DATABASE_URL`, inspect the existing schema and run `pnpm db:migrate`, provide protected SMTP secrets, confirm provider acceptance of a real test message, and complete an authenticated coordinator acceptance test covering regional visibility, status updates, and CSV/PDF exports. No database migration or coordinator email delivery is claimed complete until those runtime checks succeed.
