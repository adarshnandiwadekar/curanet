# CuraNet implementation plan

## Product scope

CuraNet is a demo-first nonprofit healthcare resource catalogue for Mumbai and Thane. It helps visitors understand fictional equipment examples, learn the NGO-mediated assistance process, submit a client-side demonstration request with their own contact details, and browse a transparent public reference directory of NGOs and CSR organisations. It is not a marketplace, allocator, referral service, or live inventory system.

## Implementation approach

- Build the public experience in the existing React/Vite client while preserving the starter Express/tRPC/Drizzle structure for future operational features.
- Keep all 30 equipment records and 12 directory records in typed client data modules so the demonstration works without a backend and makes its boundaries visible.
- Use Wouter for the required top-level routes: `/`, `/browse`, `/product/:id`, `/compare`, `/favourites`, `/request`, and `/directory`.
- Centralise the application shell, navigation, senior-friendly preferences, catalogue controls, request modal, and directory filtering in readable React components.
- Keep request submission client-side only; validate name, locality, phone, email, and context, then show a safe confirmation that repeats the selected contact preference without echoing contact details.
- Add a static route manifest at `client/public/manus-routes.json` and keep it aligned with the application router.
- Preserve platform health/auth tests and use the starter's existing server runtime for preview on port 3000.

## Project structure

- `client/src/App.tsx`: route registration and shared shell entry.
- `client/src/pages/Home.tsx`: catalogue, product detail, compare/favourites views, request workflow, and directory route presentation.
- `client/src/data/products.ts`: exactly 30 clearly fictional healthcare-equipment records.
- `client/src/data/directory.ts`: 12 public research references with official/source URLs and cautions.
- `client/src/index.css`: warm-white, forest-green, charcoal, sage, beige civic visual system with responsive layout.
- `client/public/manus-routes.json`: crawler-visible page route declarations.
- `TODO.md`: outcome-level acceptance criteria and completion evidence.

## Design direction

### Alternative style probabilities

- Editorial civic service / 0.06
- Clinical utility dashboard / 0.04
- Community field-notes catalogue / 0.08

### Chosen movement: editorial civic service

**Core principles:** direct public-service language, visible evidence and caveats, calm scanning, and respectful next steps. The interface should feel like a reliable local information desk rather than a storefront.

**Color philosophy:** warm white and beige create paper-like clarity; forest green signals care and steadiness; light sage supports low-stress grouping; charcoal protects reading contrast. No gradients or decorative effects compete with the information.

**Layout paradigm:** an editorial rail with wide reading bands, asymmetric split introductions, and clear next-step panels. Catalogue and directory content use disciplined cards only where comparison benefits from them.

**Signature elements:** a small uppercase civic eyebrow, bordered notice panels for source and demo boundaries, and a recurring numbered “what happens next” process rail.

**Interaction philosophy:** every control explains what it changes. Filters update counts immediately; resets are obvious; disabled submission is explained by field feedback; modals can be dismissed with buttons, click-away, and Escape.

**Animation:** use short, quiet opacity/translate transitions only for opening panels and card hover states. Never animate essential information or create motion that undermines senior-friendly scanning.

**Typography system:** Fraunces for major headings and Inter for body, labels, controls, metadata, and dense directory content. Use generous line height, strong focus rings, and readable minimum sizes.

**Brand essence:** a Mumbai/Thane healthcare-resource coordination demonstration that makes fictional equipment examples, next steps, and public references easy to understand. Personality: grounded, transparent, neighbourly.

**Brand voice:** headlines are confident and concise; CTAs are specific and non-transactional. Example lines: “Start with what is documented.” and “Send a demo request — not a live allocation.”

**Wordmark and mark:** a compact green wordmark paired with a simple outlined bridge/plus mark suggesting connection between a household and community support, without imitating any reference branding.

**Signature brand color:** forest green `#1f5b4d`.

## Delivery constraints

- No claim of live inventory, NGO partnership, funding, or contact routing.
- No medicines listing, exchange, delivery request, or redistribution workflow.
- No fake testimonials, invented organisation contact details, or generated organisational relationships.
- Preserve exactly 30 product records and all required route entries.
