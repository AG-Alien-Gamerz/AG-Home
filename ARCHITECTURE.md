# Architecture inspection and upgrade decisions

The project was inspected before changes: HTML entry points, both CSS sheets, active frontend modules, Firebase setup, role management, Firestore rules, localization dictionaries, storage, assets, service worker, build/deployment files and conflicted Functions source.

## Original architecture

- Vite multi-page site under `src/`, published beneath `/AG-Home/`, without a client router.
- Index handled login/signup/social/phone/guest entry; home was authenticated. Products and administration shared Firestore's `products` collection.
- `styles.css` and `styles_1.css` contained extensive overlapping neon/glass/loading rules. Both remain. Shared tokens and active business components are consolidated into `styles.css`; retired layout selectors and identical declarations were removed during the merge.
- Firebase modular SDK and existing providers; initialization duplicated across modules. Active initialization is now centralized with compatibility exports.
- Products contained bilingual name/category/description fields, tags, uploaded/hosted images, PKR prices, SKU, brand, stock, rating, specifications, generic product/download links and staff timestamps.
- Control Panel included product CRUD, reports, contact messages, owner/admin/super-admin/moderator management, chat and FCM. `ui-handlers.clean.js` was active; its unused duplicate had invalid nested imports/exports.
- 23 language dictionaries existed, but selectable languages and direction handling were incomplete. Metadata/new phrases extend them.
- localStorage retained language/theme/email visibility; Firebase owned authentication persistence. Session cleanup now preserves preferences.
- Functions source/package merge conflicts and editable profile ranks made server authorization unreliable. These required repair.
- Public asset copying was incomplete. Logo, manifest and worker are now available from `public/` after builds.

## Compatibility decisions

Product reads normalize legacy data without bulk writes. Original fields and action-wheel/report/detail functionality remain. Add/Edit saves write six platform keys and one global download URL, mirroring legacy links. Snapshots synchronize the catalogue.

New responsibilities are split into authentication validation/service, product model/editor, settings, character state/controller, UI helpers and localization. Control Panel stays focused on administration and inherits public preferences. The unused UI forwarding entry, old password-manager auth/main scripts, unused canvas logo and sample-product seeder were removed after checking runtime references. Active authentication and product data remain.

UI refinements live in `refinements.css` over the existing theme tokens. `product-form-ui.js` groups existing Add/Edit fields without replacing their IDs or handlers; compatibility and release fields are inserted before the action footer rather than inside it. `feedback-model.js` defines read/unread filtering and totals, while Control Panel retains the Firestore listener and authorized callable writes. `home-catalogue.js` renders live public product previews, and `site-copy.js` supplies the AG Home/editor/inbox copy in all configured languages.

Staff authority uses verified identities and server-owned membership records. Profile ranks are display metadata. Functions retain export names, enforce hierarchy, audit changes and reject stale current identities. Authenticated HTTP compatibility routes remain. Notifications read stored messages and attempt one dispatch, without trusting caller-supplied previews.

Sensitive operations require verification; guest sign-in/public browsing remain. Reset and email-change actions use Firebase codes. MFA needs Identity Platform configuration. TXT email files are source copy, not an invented template loader.

No production migration/deployment or Console change occurred. Original English legal-policy source remains separate from translated interface strings. See README and TESTING for setup and verification boundaries.

## Team and organization extension

The existing static About Team card was inspected with public entry points, theme variables, Firestore rules, authentication/role checks and Control Panel navigation. It now renders from `organization/main`, also used by the new direct `team.html` route. The original supplied biography, image and portfolio are retained in one shared bootstrap source. Timeline, organizational graph, data subscription, profile rendering, administration and native interface phrases are separate modules. No authentication profile collection is used as the public team directory.

`functions/team-model.mjs` is a pure shared contract bundled by Vite and included within the Functions deployment directory. `manageTeam` reuses the existing current-identity authorization, performs revision-checked transactions, sanitizes editable fields, validates dates/hierarchy/assets and audits changes. Organization writes are server-only. Member end dates are independent of other members and team assignments; transfers append dated history with original hierarchy snapshots. About, Timeline and Mind Map use Firestore snapshots rather than duplicated hardcoded cards. Team Management extends the existing sidebar/section mechanism and adds no theme/language controls.

## Connected product catalogue

Public product consumers now subscribe exclusively to Firestore's `products` collection through `product-data.js` and the testable snapshot adapter `catalogue-source.js`. Loading, empty, error and deletion states never synthesize records. No catalogue marker or product-name registry is used by public pages or the product editor. Shared generic normalization in `product-model.mjs` retains saved fields and compatibility with legacy links.

Schema 3 adds explicit ready/pending/disabled link status, owner references and development categories while preserving the six-platform/one-download-site architecture. Schema 2 URL requirements remain strict. Unknown URLs/descriptions/prices/status are not fabricated. The existing optional administrator-only `initializeCatalogue` transaction and server registry remain separate from public fetching and execute only on an explicit import action. Ordinary later edits still notify. `manageTeam` derives server-owned `memberIds` for rules to verify product ownership; clients cannot forge that index or the import timestamp.

Cards/details, Home previews, organization product branches, filters and a member's grouped product list use the same catalogue. Exact hash routes reuse existing multipage navigation. A multi-platform product has one canonical record and multiple graph occurrences. Products reference people without duplicating profiles; timelines and assignments retain their independent history. Native labels, biography/responsibility translations and scoped theme/RTL styles extend the existing localization and stylesheet systems.
