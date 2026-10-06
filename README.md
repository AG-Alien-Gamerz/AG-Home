# AG Home

[Website](https://ag-alien-gamerz.github.io/AG-Home/) · [Repository](https://github.com/AG-Alien-Gamerz/AG-Home) · [Deployment guide](DEPLOYMENT_COMMANDS.md)

AG Home is the existing Vite/Firebase business and software-product website, upgraded in place. The public catalogue uses the same Firestore products as the Control Panel. Email/password, existing social/phone/guest sign-in, product metadata, reporting, contact messages, staff management, chat, notifications, themes and stored preferences remain in the existing architecture.

## Push and publish

The repository includes automatic GitHub Pages deployment from **`master`**, which remains the default source branch. Enable Actions and select **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: gh-pages → /(root)**, then Save. Keep the repository name **`AG-Home`**, matching the existing `/AG-Home/` asset, manifest and authentication paths. Add this repository as your local `origin` if needed, commit the source and push `master`.

The workflow installs locked dependencies, runs unit tests, builds and verifies all nine application pages and static links, automatically creates/updates **`gh-pages`** with only `dist/`, and requests a build of the configured Pages branch through GitHub's REST API. The branch is generated output; make changes on `master`. Feature-branch pushes do not publish. Manual reruns are available under **Actions → Deploy to GitHub Pages → Run workflow**, selecting `master`. The built-in `GITHUB_TOKEN` needs `contents: write` for publishing and `pages: write` for requesting the build; no personal token is required. This explicit request is necessary because token-created branch commits do not trigger a Pages build. The deploy job confirms the request was accepted; GitHub's separate **pages build and deployment** run confirms actual publishing. [Publishing documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages build API](https://docs.github.com/en/rest/pages/pages#request-a-github-pages-build).

The existing AG Firebase public configuration works without new repository secrets. Optional `VITE_FIREBASE_*` and `VITE_FUNCTIONS_REGION` repository variables override it; previously configured secrets remain supported. Local `.env` files are ignored and are not uploaded. The actual Pages URL appears in the successful deployment and repository Pages settings; authorize that **actual account domain** in Firebase Auth and update the action URL if you moved accounts. Firebase rules/Functions and Console settings remain separate from static Pages deployment.

See [DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md) for one-time setup, exact push commands and recovery steps. See [TESTING.md](TESTING.md) for verification evidence and [ARCHITECTURE.md](ARCHITECTURE.md) for the existing design.

The authenticated Home is AG's hub, with links to products, information about AG and contact, plus live previews from the existing product collection. `src/css/refinements.css` provides the Home presentation, reference-style social buttons, inbox and product editor refinements over the shared theme tokens in `styles.css`. Home copy is translated in `src/js/site-copy.js`, and Privacy navigation uses `src/js/privacy-translations.js`; the same RTL/LTR and reduced-motion preferences apply.

Primary public navigation uses a rounded card, an animated underline and an active-tab background. Social buttons transition between provider-specific hover colours and show a spinner during actual pending operations; reduced-motion users get a static loading indicator. Opening Settings hides its launcher until the dialog closes, with expanded-state semantics and keyboard focus restoration. About uses the shared footer outside its content wrapper, with a footer at the bottom of short pages and a stacked mobile layout.

Product cards lift, gain a stronger shadow and highlight their actions on pointer hover; keyboard focus also highlights the card. Reduced motion disables the lift. Add/Edit compound labels are localized once, with translated child spans reused on subsequent DOM updates, preventing repeated Name/Description/English/Urdu labels and horizontal overflow.

The Control Panel sidebar and main content scroll independently within the viewport. On mobile/tablet the navigation becomes a bounded, independently scrollable top region. Global chat keeps its existing Firestore collection and record shape: `senderName` now stores the sender’s profile username when available. Display names prioritize accessible profile usernames, then existing non-email names, then a legacy email-prefix alias. Private profile permissions remain unchanged; a viewer without access to an older sender’s profile gets the stored name/alias. Own messages are identified by Firebase UID (with email fallback only for legacy records without a UID), displayed at inline-start—left in LTR and right in RTL. Other messages use the opposite side. Character collision avoidance covers control-panel desktop/tablet controls as well as mobile; dragging remains available.

The Control Panel inbox offers **All / Unread / Read** filters with live totals. Existing messages without a status count as unread. Marking a message read or unread still uses the authorized `updateMessage` callable; Firestore updates move the message between filters immediately. Revisiting the inbox reuses its listener.

Add and Edit Product share a section navigator, a scrollable form body and a footer that keeps Save/Cancel visible. Compatibility fields remain part of the form body, with the six existing platforms and the separate global download-site option. Existing field IDs, validation, image uploads and saved data are preserved.

## Team history and organization

`team.html` is a public page linked from the existing navigation and About. Its timeline shows **Muhammad Hamza Sabir — 1 May 2024 → Present** as the sole initial member, with his supplied role, biography, photo and portfolio. Frontend, Backend and Design branches come from the requested initial structure; the initial assignment is Frontend Team, and empty branches remain visible. There are no sample employees in production data.

About, the timeline, profile panels and organizational map subscribe to the same public Firestore document, **`organization/main`**. `functions/team-seed.json` is the one bootstrap source used by the public fallback and server; it is not a second editable catalogue. A missing document shows the explicitly labeled initial published record. A read failure shows a localized network message and retains the last available data. After the first successful administrative save, snapshots are authoritative across all views.

The data model stores `schemaVersion`, `revision`, `nodes[]` and `members[]`. Nodes have `id`, `name`, `type` (`root`, `department`, `team`) and `parentId`. Members have a membership ID, name, role, ISO `startDate`, nullable `endDate`, avatar, bio, skills, optional portfolio and chronological `assignments[]`. Each assignment records a node, role, start/end dates and a snapshot of its original hierarchy names/IDs, preserving history when branches are renamed or reorganized. Department/team/parent relationships and current/former status are derived; **“Present” is translated at render time and is never stored as a date**. Dates are formatted with the selected locale without timezone shifts.

Current/former/full-history filters combine with name/role/skill search, department and year. Year filtering uses membership and assignment periods; Current Team without a year uses the current assignment. The map defaults to current memberships, with former/all-history options. It supports zoom buttons, keyboard `+`/`-`, arrow-key scrolling, mouse dragging on its background, native touch scrolling, reset, branch expansion/collapse and department/team/person selection. On mobile it becomes a vertical tree. Profiles connect timeline ↔ map, include assignment history and keep the full authored biography in an expandable details area. All 23 existing language selections translate interface labels and respect RTL/LTR; names retain their authored form; the supplied biography and responsibilities now use native translations, while administrator-edited content stays intact.

Verified **Owners, Super Admins and Admins** get Team Management in the existing Control Panel. Moderators and ordinary visitors cannot manage organization data. Add/edit members, explicitly set leaving dates, assign teams, change roles, add skills/bios/portfolio and change/upload avatars. Add/edit organizational branches and their parent relationships without changing source code. Avatar uploads accept PNG/JPEG/WebP up to 4 MB, resize to 400 pixels and store bounded WebP data; URLs must be HTTPS. No private login profile, email, phone or date of birth is published.

Adding a member never closes another member. Changing an existing assignment requires a real transfer date and closes only the old assignment. Membership ends only when an administrator explicitly supplies its end date. Joining dates and former membership records are retained; a later rejoining uses a new membership record. There is no delete-history action. Server-side checks reject invalid/future/reversed dates, missing references, cycles, unsafe URLs/images and stale editor revisions. Changes use a transaction with an audit entry. Current identity and administrator rank are checked on the server; Firestore rejects direct organization writes even from a client claiming to be an owner. Team positions do not grant application authentication privileges.

### Enable live Team Management

An authorized Firebase administrator must deploy the new callable and public-read/server-write rules; this machine has no administrator Firebase login. Production has not been deployed or seeded automatically:

```powershell
npx firebase login
npx firebase deploy --project ag-home-3db3f --only functions:manageTeam,firestore:rules
npm run build
```

Publish the resulting static build using the existing hosting workflow. Then sign in as a verified administrator, open Control Panel → Our Team, edit the initial record and Save. That first transaction initializes `organization/main` from the supplied seed; subsequent members/branches are managed entirely through the Control Panel. Keep privileged credentials on the backend. The current bounded document supports up to 150 membership records, 100 branches, 12 hierarchy levels and 850 KB of serialized data; larger organizations should migrate to paginated collections before approaching these limits.

### Products, ownership and the organization map

The map has **AG → Teams / Departments** and **AG → Products → enabled platforms → products**. Platform branches expand on selection, and search finds products, platforms, people, departments and development areas. Different node styles identify each type. Clicking a product node opens that product's details on Products using a native link; its separate information button opens a preview within the map. `products.html#product=<document-id>` opens the corresponding details, and `team.html#member=<membership-id>` opens its developer's profile. Multiple platform nodes refer to one product record: AG Nexus appears under Windows and Android without duplicating its data.

**Public products come exclusively from Firestore's `products` collection.** The shared `product-data.js` subscription feeds Products, filters, Home previews, the map and profiles. No bundled product registry, catalogue marker or local fallback participates in public loading. An empty collection produces an empty state; failed loading produces localized recovery guidance. Snapshot changes propagate additions, edits and deletions without resurrecting records. Product names do not infer platforms, ownership or versions; the editor normalizes only the saved database fields.

Products store **`ownerIds[]`** references to Team membership IDs and **`developmentCategories[]`** identifiers. No biography or independently maintained product list is copied into products or profile HTML. “Built by” resolves real Team records; “Products developed” derives and groups matching records by platform. The Control Panel product editor can assign existing people and actual development areas. These responsibilities do not grant staff privileges. Former membership records and their work remain until an administrator explicitly changes responsibility references.

The optional **`websiteUrl`** field holds a product information or marketing website independently of platform compatibility. A desktop application's marketing page does not make it a web application. Save the actual platforms and marketing URL in the database rather than relying on product-name defaults. Existing generic legacy links retain the generic legacy normalization behavior. The editor distinguishes this optional information URL from the Website platform link and the separate global Download Website link.

Saved products may use **schema 3 pending links**, empty descriptions, unknown prices and unspecified release status. Pending records are editable by marking a platform link or the global download website unpublished. Ready links require valid URLs; pending links never render empty buttons. Existing configured links and explicit disabled choices remain authoritative. Reporting is available for saved product documents. The complete supplied biography and responsibilities are localized in all 23 configured languages, including Urdu; edited custom copy retains its authored text.

### Existing optional administrator import

The existing manual **Control Panel → Products → Import confirmed catalogue** feature is preserved separately from public fetching. Its server-only `functions/product-seed.json` registry is never bundled into the website or rendered as fallback data. Only an explicit verified Owner/Super Admin/Admin action invokes `initializeCatalogue` and writes those records to Firestore. It preserves matching document IDs, configured content and confirmed versions, validates team references and records its one-time marker. Browsing public pages never imports products or reads that marker. Administrators can continue adding/editing individual database products through the existing editor.

```powershell
npx firebase login
npx firebase deploy --project ag-home-3db3f --only functions:manageTeam,functions:initializeCatalogue,functions:onProductChanged,firestore:rules
npm run build
```

Publish the static build using the existing workflow. Configure real product records, URLs and authored descriptions through the Control Panel. The optional import is an explicit administrative choice, not a prerequisite for fetching products. This database-only fetching change requires a static site update; existing production records are not migrated or deleted. Firebase CLI on this machine has no administrator session, so any required production deployment remains manual.

## Development

Use Node 24 for Vite and tests. Deployed Cloud Functions target Node 22. Install Java 21+ for the Firestore emulator and Chrome for browser tests.

```powershell
npm ci
npm --prefix functions ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:5173/AG-Home/`. Fill `.env.local` from the existing Firebase web app configuration. `src/js/firebase-config.js` owns a single initialization and retains the original `ag-home-3db3f` public configuration as its fallback. `VITE_*` values are compiled into public JavaScript; never put service-account credentials or backend secrets there. Rebuild after changing them.

| Setting | Purpose |
| --- | --- |
| `VITE_FIREBASE_*` | Existing web app configuration and optional FCM VAPID key |
| `VITE_FUNCTIONS_REGION` | Existing callable region, `us-central1` |
| `VITE_USE_EMULATORS` | Explicit development-only connection to Auth 9099, Firestore 8080 and Functions 5001 |
| `VITE_ENABLE_TOTP_MFA` | Exposes enrollment after the backend supports TOTP; defaults to false |
| `functions/.env.local` | Local backend environment; production settings belong in `functions/.env.<project-id>` or managed secrets |
| `ALLOWED_ORIGINS` | Backend comma-separated origins for legacy HTTP endpoints; include the actual deployed host |

The owner allowlist is retained in `role-manager.js`, `functions/permissions.js` and the rules. Change all three together if ownership changes. `VITE_ADMIN_EMAIL` cannot grant authorization.

## Safe local testing

Tests use only `demo-ag-home` and deliberately replace that demo project's test products. Do not change their project to production. Start the emulators in one terminal:

```powershell
npx firebase emulators:start --project demo-ag-home --only auth,firestore,functions
```

On a memory-limited Windows machine, set `$env:JAVA_TOOL_OPTIONS='-Xms128m -Xmx768m -XX:MaxDirectMemorySize=128m -XX:ReservedCodeCacheSize=64m'` in that terminal before starting the emulators. Browser tests use one worker; run database-mutating suites sequentially. These limits apply only to local Java emulator processes.

Start Vite in a second terminal:

```powershell
$env:VITE_USE_EMULATORS='true'
$env:VITE_FIREBASE_PROJECT_ID='demo-ag-home'
$env:VITE_ENABLE_TOTP_MFA='true'
npm run dev -- --host 127.0.0.1
```

Run `npm test`, `npm run test:rules`, `npm run test:functions` and `npm run test:browser`. Browser tests use local demo accounts and intercept external requests. The Auth emulator's TOTP endpoint returns `Missing phoneEnrollmentInfo`; the TOTP scenario therefore uses explicitly identified SDK contract fixtures. Password, verification, reset and email-change scenarios use real emulator APIs. See [TESTING.md](TESTING.md) for coverage and remaining live-service checks.

## Pages and modules

The public header includes a localized account link: **Log In** for visitors and **Home** for verified email sessions. Header/footer visibility does not depend on completing an entrance animation. On the login entry, `public/auth-entry.js` bounds the initial hidden auth state to eight seconds: failed/delayed startup reveals a recovery box with Reload instead of leaving a blank page. Until Firebase has resolved the initial state, it blocks native auth form submission and provider actions; it never grants access to protected pages. Late initialization dismisses the recovery message. Run `npm run test:entry` for the isolated production-bundle checks (desktop/mobile, four themes, interrupted animations, blocked/late startup, RTL and reduced motion); these checks block external service requests.

| Area | Entry points |
| --- | --- |
| Logged-out login/signup/reset | `src/index.html`, `app.js`, `auth-service.js`, `auth-validation.js` |
| Authenticated business home | `src/home.html`, `home.js` |
| Public products/details/reporting | `src/products.html`, `products.js`, `product-model.js` |
| Existing administration | `src/control.html`, `control.js`, `ui-handlers.clean.js`, `role-manager.js` |
| Product compatibility editor | `product-editor.js`; mounts into the original Add/Edit forms |
| Settings and account security | `settings.js`, existing `theme.js` |
| Language/direction | `localization.js`, `language-data.js`, `interface-translations.js`, `admin-localization.js` |
| Character | `character.js`, `character-state.js`, `src/css/character.css` |
| Email action handler | `src/auth-action.html`, `auth-action.js` |
| Shared visual layer | `src/css/styles.css` preserves the original components and contains shared theme tokens and business styling; page-specific refinements remain separate |
| Backend authorization | `functions/index.js`, `functions/permissions.js`, `firestore.rules` |

[ARCHITECTURE.md](ARCHITECTURE.md) records the inspection and compatibility decisions. Earlier guides are historical; this README and the checked-in rules describe current setup. Five unreferenced prototype modules (`auth.js`, `main.js`, `logo.js`, `sample-products.js`, `ui-handlers.js`) were removed after checking imports and HTML entry points. Active authentication, logo assets, product data and `ui-handlers.clean.js` remain.

## Product platforms and links

Each Add/Edit form has exactly six platform checkboxes: Website, Windows Software, Linux Software, Chrome OS, Android Application and Apple Application. All 64 combinations, including none, are supported. A selected platform requires its own valid HTTP/HTTPS URL unless explicitly marked unpublished in schema 3; HTTPS is preferred. Unchecking it clears and disables its field and pending state. Credentials, script URLs and URLs longer than 2048 characters are rejected. Schema 2 remains strict for backward compatibility.

`Download Site Link` is separate and enables exactly one global URL. The public **Download Website** button is an ordinary direct link; it does not infer an operating system, enable the Website platform or create additional download-site fields. Schema 3 supports explicit `downloadSite.status` values `ready`, `pending` and `disabled`: a pending site has an empty URL and no public button; a ready enabled site requires a valid URL. In the editor, clear the unpublished checkbox and enter the actual URL to publish it. Schema 2 retains its strict enabled/URL validation. Deploy the updated Firestore rules before saving pending download websites to production.

```json
{
  "schemaVersion": 2,
  "platforms": {"website": true, "windows": true, "linux": false, "chromeOS": false, "android": false, "apple": false},
  "links": {"website": "https://example.com", "windows": "https://example.com/windows", "linux": "", "chromeOS": "", "android": "", "apple": ""},
  "downloadSite": {"enabled": true, "url": "https://example.com/download"}
}
```

Original price, tags, SKU, brand, category, stock, rating, descriptions, bilingual fields and images remain. Version/status fields are added. Public details show an existing `screenshots` array of URLs when supplied, without staff metadata. Search, category and platform filters work together, retaining the newest-first ordering, grid/list view, details, action wheel and reporting. Platform filtering uses the same normalized six-platform contract as the editor and badges: a product appears under every enabled platform. Legacy website links remain discoverable; a generic download link does not imply an operating system. Filters persist through language changes and live product snapshots.

## Privacy presentation and global styling

The Privacy page retains all eleven policy sections and its retention table. Desktop uses separate bounded scroll regions for the Quick Links list and legal document, with scroll containment and a current-section indicator. On tablets/mobile, the links become a compact horizontally scrollable navigation strip above the document. Anchors support direct URLs, browser history, keyboard focus and reduced motion. Navigation labels are translated in all 23 configured languages; the original legal document is explicitly English/LTR while the surrounding layout follows the selected language. The old `.local` mailbox placeholders now link to the existing Contact page; configure a real privacy/DPO address before publishing a dedicated email contact.

`styles.css` is the main stylesheet on all nine pages. Existing components and responsive rules remain, with shared theme tokens and active business components merged into it. Retired hero/sidebar/privacy rules and identical declarations were removed instead of copying an extra stylesheet wholesale. `styles_1.css` retains legacy page-specific components, while `refinements.css`, `character.css` and `auth-action.css` keep their focused responsibilities. Privacy presentation is scoped to its page and no longer uses an inline stylesheet.

For products outside the confirmed registry, legacy `productLink` continues to normalize to Website; confirmed Windows products use the information-website distinction described above. Legacy `downloadLink` normalizes to the global download website because its operating system is unknown. No production records are automatically rewritten. Saving a legacy product writes schema 2, or schema 3 when retaining unpublished links, an information website or an unknown price, and mirrors both legacy links. Firestore snapshot listeners synchronize public changes.

Image uploads remain inline raster images, limited to 500 KB per file to stay below Firestore document limits. Hosted image URLs remain supported. Old records remain readable; oversized legacy images must be replaced/compressed before a modern save. Inline SVG is rejected. No unconfigured Storage uploader is invented.

## Authentication and verification

Signup requires First Name, Second Name, Email, Username, Password, Confirm Password and Date of Birth; Last Name is optional. Mismatching passwords cannot reach account creation. The minimum is eight characters; the assistant recommends 12+, mixed case, numbers and symbols without displaying or storing the password.

Login accepts email or username plus password. Email login goes directly through Firebase Auth. Username login uses the `signInUsername` callable: it privately resolves a unique profile, checks the current Admin Auth identity, verifies the password through Firebase Identity Toolkit, then lets the browser perform ordinary Firebase sign-in. Passwords are relayed over HTTPS only for this verification; they are never logged or stored. No custom tokens bypass MFA or email verification, and profile emails remain private. Incorrect or ambiguous usernames receive the same generic credential error. The private `_loginAttempts` collection limits attempts to 30 per IP per ten minutes; configure Firestore TTL on `expiresAt` to clear old counters.

Before deploying username login, copy `functions/.env.example` to `functions/.env.ag-home-3db3f`, fill `FIREBASE_WEB_API_KEY` with this project's Firebase web API key, and deploy `signInUsername` and `normalizeProfileUsername`. This is the Firebase public web key, not a service-account key. Existing profiles can be indexed using trusted Application Default Credentials: first run `node scripts/backfill-usernames.cjs --project ag-home-3db3f` for a dry run, review duplicate usernames, then append `--write`. The script modifies only `usernameKey`. New/changed profiles are indexed by the server trigger. Until backfilled, older usernames work with their stored spelling; normalized case-insensitive matching requires the index. Duplicate normalized names need resolution or email login. If password reCAPTCHA Enterprise enforcement is enabled in Console, its additional token flow needs configuration before using the server password relay.

Phone sign-in uses Firebase SMS confirmation and E.164 numbers with an explicit country code. Both steps support Enter; dialog dismissal clears confirmation/OTP/reCAPTCHA state, and Send/Resend share a 60-second cooldown. Wrong codes can be retried and expired codes request a new SMS. Only an explicit development `demo-*` emulator configuration disables app verification; production uses real reCAPTCHA. Enable the Phone provider, authorized hosting domains, SMS regions and required billing in Console, and use configured Firebase test numbers when validating without real SMS. [Firebase phone setup](https://firebase.google.com/docs/auth/web/phone-auth). SMS delivery has not been tested against the live project.

Firebase sends verification after signup, then signs the new account out. Email accounts cannot enter authenticated Home until Firebase reports `emailVerified=true`. Login checks a fresh Firebase user record and token before navigating; an unverified account is signed out and sees a verification notice on the login page. Enter email/password and use Resend to request another verification, or retry the same social provider for a social account. Resending has a 60-second client cooldown and Firebase server throttling. Verified email appears as a small status badge in Settings, without a Home banner. Administration, reports, contact submissions and sensitive account changes also require verified email at the rules/backend layer. Guest and phone-only sessions retain public product browsing, but cannot bypass verified-email access to authenticated Home.

The logged-out entry remains hidden until Firebase resolves persisted auth; verified email users redirect to `home.html`. Restored unverified email sessions are signed out. Protected pages wait for auth/authorization. Logout uses Firebase `signOut`, clears only named app session keys/cookies (including pending-verification state), and retains language, theme, character preferences and unrelated browser data. Firebase persistence is not manually deleted.

Reset requests validate email and use a generic result without disclosing account existence. Firebase owns all action codes. The action page checks reset, verification, email-change and recovery operations, handles invalid/expired/used/malformed codes, removes codes from browser history, and never follows an untrusted `continueUrl`. Email changes require reauthentication and `verifyBeforeUpdateEmail`. TOTP/SMS challenges are handled during login and security reauthentication.

Accepted verification/resend, reset and email-change requests show a dismissible mailbox tip in the relevant form. It mentions Spam/Junk and Promotions/Updates/Other tabs in all 23 configured languages. This is guidance, not a delivery receipt; reset requests retain their account-neutral result. Failed network/reauthentication requests do not create a new tip. Phone/MFA SMS requests do not show an email tip.

`auth-action.html` has an AG-branded responsive card, theme/RTL support, password confirmation, strength guidance and distinct loading/error/success states. The recipient is displayed only after Firebase validates the reset code. The default `firebaseapp.com/__/auth/action` page cannot inherit this repository’s CSS. **After deploying, open Firebase Console → Authentication → Templates → Password reset → Edit → Customize action URL**, set the deployed `/AG-Home/auth-action.html` URL and save. Check the shared action URL for verification and email-change templates too, then request a new email to verify its link. The SDK’s `actionSettings().url` is a continuation destination, not this custom handler setting. Older delivered links may still open the default handler. Console configuration has not been changed from this workspace.

### Required Firebase configuration

1. In **ag-home-3db3f**, enable Email/Password under Authentication → Sign-in method. Enable existing Google, GitHub, Yahoo, phone and anonymous providers with real credentials/settings. Facebook's existing hidden buttons remain hidden. Configure OAuth callback URLs and phone reCAPTCHA/SMS settings.
2. Add the actual hosting domain and development `localhost`/`127.0.0.1` under Authentication → Settings → Authorized domains. Enable email enumeration protection where available. Set the public-facing app name to **AG Home**.
3. Under Authentication → Templates, set the action URL to deployed `https://ag-alien-gamerz.github.io/AG-Home/auth-action.html` (or the actual host/path). Test a delivered link after deployment. Source changes cannot configure Console templates. [Firebase action handler guidance](https://firebase.google.com/docs/auth/custom-email-handler).
4. Retain sender **noreply@ag-home-3db3f.firebaseapp.com**. Apply the email mapping below only to editable fields.
5. For TOTP, upgrade Auth to Identity Platform, then enable the TOTP provider through a privileged Admin SDK/project configuration operation. Build with `VITE_ENABLE_TOTP_MFA=true` only afterward. Verified users can enroll, answer challenges and remove factors after reauthentication. The browser cannot enable project-level MFA. [Firebase TOTP setup](https://firebase.google.com/docs/auth/web/totp-mfa).
6. Deploy functions/rules and audit existing `admins`/`moderators` records through a trusted server/Console before granting access. Previous rules trusted editable profile ranks; those ranks are no longer authorization sources.
7. For FCM, configure the Web Push VAPID key, allow notifications, and verify the copied service worker matches the selected project. Emulators do not deliver production push messages. Keep deployment credentials on the backend.

### Social sign-in domain configuration found during review

A read-only request to the project's public Firebase Auth configuration on 6 October 2026 returned `localhost`, `ag-home-3db3f.firebaseapp.com`, `ag-home-3db3f.web.app` and `ag-alien-gamerz.github.io` as authorized domains. The current repository is **AG-Alien-Gamerz/AG-Home**, so its Pages host matches that observed domain. Verify it remains allowed before release. The former host `ag-pixel-creater.github.io` was missing, as was `127.0.0.1` for local production-project testing. Firebase CLI has no signed-in project administrator on this machine, so the live configuration was not changed.

In Firebase Console → **ag-home-3db3f** → Authentication → Settings → Authorized domains, check **`ag-alien-gamerz.github.io`** (domain only, without `https://` or `/AG-Home/`). Add `127.0.0.1` only if using that address with the live project. Keep other domains you still use. In Sign-in method, enable Google/GitHub/Yahoo as needed and configure each provider's genuine credentials and Firebase callback URL. The site now explains blocked popups, disabled providers, unauthorized domains and conflicting sign-in methods instead of a generic error. Google uses account selection; providers request email access, and only Firebase-verified emails can enter Home. Browser popup tests use the real Firebase SDK and local Auth emulator; they do not prove live provider credentials or domain setup.

Settings offers exactly four themes: modern **Light**, modern **Dark**, **Light Legacy** (white/grey) and **Dark Legacy** (black/grey, without navy). `theme-model.js` shares the allowed names with Settings and theme application; early `public/theme-init.js` restores them before paint. A saved retired blue preference migrates to modern Dark. Theme buttons expose pressed state, original CSS variables map to the shared palette, and Settings/forms/cards use consistent surfaces. Subtle panel/page transitions and button states respect reduced motion. The Control Panel inherits saved preferences without extra controls. About's explicit brand, centered title and Settings action use a responsive shared header.

## Email source templates

The four TXT files are source copy/documentation; Firebase does not load TXT files automatically. Each contains the requested subject, sender and professional Urdu wording. Paste the subject separately; do not paste `Subject:`/`Sender:` headers into the body. Keep supported placeholders intact.

| File | Firebase template / application |
| --- | --- |
| `Emails/Verification_Email.txt` | Email address verification; `%LINK%` verifies the address |
| `Emails/Password_Reset_Email.txt` | Password reset; `%LINK%` is Firebase's reset action |
| `Emails/Email_Change_Email.txt` | Email-change notification; `%NEW_EMAIL%`, `%LINK%` restores the previous address |
| `Emails/MFA_Email.txt` | Enrollment notification where offered by configured Identity Platform; `%SECOND_FACTOR%`; no invented recovery link |

Firebase permits sender/subject edits but restricts some built-in message bodies, including verification/email-change. Full Urdu copy remains source where Console editing is unavailable. Arbitrary bodies require a separately configured trusted mail service using genuine Firebase action links; this project does not pretend to configure one. Placeholders depend on the selected template. [Firebase email customization](https://support.google.com/firebase/answer/7000714?hl=en).

No generated code is hardcoded. No email claims device/IP/browser/network verification. The MFA file is not automatically sent by frontend JavaScript, and no unsupported security URL is fabricated.

## Contact map and loading screen

Contact's Location button opens an on-site Leaflet map with an independently scrollable office sidebar, search and keyboard/Escape dismissal. Offices come from `public/data/offices.csv`: required columns are `id,type,name,latitude,longitude`; optional columns are `address,keywords,demo`. IDs must be unique and coordinates valid. The supplied AG Headquarters at **24.959269, 67.131587** is explicitly a demonstration location. Keywords include “Head Quater”, “Head Office” and “HQ”. Add real offices by editing this CSV rather than duplicating JavaScript records.

Map controls, search, permission/load errors and retry states have translations for all 23 languages and support RTL. “Show my location” requests browser permission only when pressed; coordinates stay in memory and are not saved or submitted to AG. Map tiles are requested from OpenStreetMap, which receives normal map-view requests. Attribution remains visible; no offline/bulk download is implemented. See [Leaflet documentation](https://leafletjs.com/reference.html) and [OpenStreetMap tile policy](https://operations.osmfoundation.org/policies/tiles/). Hosting must permit HTTPS tile requests; location permission requires HTTPS or localhost.

Phone and Email buttons reveal keyboard/focus/hover menus. The two `+1 202 555 01xx` numbers are labeled fictional examples, not AG contacts. Replace them with real numbers before publishing. Email links use `ag.aliengamerz@gmail.com` and `ag.aliengamerz@hotmail.com`.

All nine page entries use a brief theme-aware, localized loading overlay. It clears after initial document rendering, respects reduced motion and has a five-second fallback; it does not replace Firebase authentication guards. Products now expose one visible category selector and an AG monogram when a product image fails.

### Live phone-error reporting deployment

On 6 October 2026, the live `us-central1-ag-home-3db3f.cloudfunctions.net/reportAuthError` preflight returned **404**, without CORS headers. Firebase CLI has no authenticated administrator on this machine. The callable implementation is present and tested locally, but production reporting requires deployment by an authorized administrator: run `npx firebase login`, then the Functions/rules deployment below. Static-site deployment alone cannot create the endpoint. The UI now explains an unavailable reporting service and keeps the retry action available; it never invents a successful Feedback submission or bypasses server authorization. The reCAPTCHA Enterprise-to-v2 fallback message alone is not an SMS error diagnosis; inspect Firebase's actual response code and complete billing/provider/domain configuration.

## Localization and direction

All 23 existing selections work: English, Urdu, Arabic, Turkish, Japanese, Chinese, Punjabi, Pashto, Balochi, French, Spanish, German, Sindhi, Hindko, Saraiki, Hindi, Roman Urdu, Bengali, Russian, Italian, Portuguese, Korean and Indonesian. Metadata controls `html.lang`, `html.dir` and logical spacing. Urdu, Arabic, Punjabi (Arabic script), Pashto, Balochi, Sindhi, Hindko and Saraiki are RTL; Roman Urdu and the others are LTR.

Shared UI, forms, validation, verification/reset states, settings, compatibility/actions, reporting and administrative labels use translated dictionaries. Controls remain in public Settings; the Control Panel inherits preferences without added theme/language controls. Product copy uses `name_<language>`/`description_<language>`/`category_<language>` or the existing translations map. Administrator-authored content falls back to original text if no translation is supplied; user data is not artificially translated. The original English legal-policy text remains, with localized navigation; authoritative legal translations require separate review.

## Character and accessibility

The CSS-built character defaults to the male Robot. Public Settings offers **Robot**, **Hamza · Pakistani boy**, **Fatima · Pakistani girl**, **Anime boy** and **Anime girl**, with an immediate preview and labels in all 23 languages. Robot retains its separate male/female choice when switching away and back. The persistent `ag.character.appearance` field defaults safely to Robot for older settings, preserving saved positions and preferences. These stylized figures use native HTML/CSS and the existing interaction system, without an external rendering service.

Settings also controls visibility, the validated 1–120 minute sleep timer (default 15), magnifying-glass follow/fixed mode and position reset. Every appearance retains password eye-closing, temporary torch visibility, reading, happy/celebration and idle/sit/yawn/sleep reactions, along with reduced motion. Drag either object with touch/pointer or arrow keys; normalized positions persist in `ag.character` within viewport boundaries and synchronize between open tabs. Modals hide the character; overlapping focused fields move it away.

Password focus and torch interaction keep its eyes closed. The torch temporarily changes only standard input visibility, resets after eight seconds/blur/tab hiding, and never copies the password. Strength guidance, success/error/waiting reactions, reading after a quiet interval and idle → sit → yawn → sleepy → sleep states are implemented. Clicking, typing, touch and scrolling reset inactivity; mouse jitter does not. Reduced motion disables decorative movement. Modals trap focus, support Escape/outside dismissal and restore prior focus. Forms/buttons have visible focus/error states.

## Security and deployment

### Background notifications and phone-error reports

`notifications.js` provides one opt-in flow shared by public Settings and a compact Notifications disclosure in the staff header. Enabling requires a verified account, browser permission, HTTPS/localhost and `VITE_FIREBASE_VAPID_KEY` from Firebase Console → Project settings → Cloud Messaging → Web Push certificates. Permission is requested only by the toggle. Opt-out removes this browser's server subscription; logout disables its worker and deregisters the token before sign-out. Each device is independent. The service worker is registered beneath `/AG-Home/` with the current build's public Firebase configuration, uses persisted enabled/user state and rejects pushes for another account. It opens only allowlisted AG pages. Foreground messages use a toast; background data-only FCM messages use native notifications without a duplicate automatic notification.

Deploy `setPushSubscription`, `onNewMessage`, `onNewReport`, `onNewChat`, `onProductChanged` and `reportAuthError` with the existing Functions. Normal verified users receive product additions/updates. Current server-authorized Moderators, Admins, Super Admins and Owners also receive feedback, reports and global staff chat alerts; chat/feedback/report senders are excluded from their own alerts. Role checks use current Auth identity and server role records, never browser roles. Tokens are stored only in server-owned `pushSubscriptions`; revoked/disabled/unverified accounts are skipped and invalid tokens removed. Delivery is best effort with event deduplication; a failed send is not retried automatically. Configure TTL on `_pushEvents.expiresAt` and `_authReports.expiresAt`. Browser/OS background limits still apply; test a real permitted mobile/desktop device after deployment. Local tests use a mock FCM sender and worker runtime and do not prove live push delivery.

Phone SMS failures expose a localized billing/setup note and **Report to AG** button. Pressing it sends only the Firebase error code to a rate-limited callable (three reports per IP/hour), which creates an unread Feedback Message. It does not send the phone number, OTP, password or raw error payload. A 400 response alone does not prove billing is the specific cause: Firebase's response code distinguishes billing, provider, region, quota and reCAPTCHA issues. Firebase SMS requires billing; Console changes remain manual. The Enterprise-config message followed by v2 fallback is not itself proof that SMS failed. [Firebase phone requirements](https://firebase.google.com/docs/auth/faq-and-troubleshooting).

Vite and Firebase Hosting now send `Cross-Origin-Opener-Policy: same-origin-allow-popups` for OAuth popup compatibility. Restart Vite to apply the header. GitHub Pages cannot apply this Firebase Hosting header; provider-controlled popup headers may still produce console warnings even when login succeeds. [Google popup guidance](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid). Existing navigation underline and social shine mechanics from the original styles are reused in `styles.css`; Privacy quick-navigation is excluded from the public-menu animation.

`firestore.rules` is canonical; `Firebase.rules` is a synchronized compatibility copy. Products are publicly readable and writable only by verified staff, with schema/link/image/number validation. Profiles are private and cannot self-assign ranks. Membership changes run through authenticated, verified Functions with hierarchy checks and audit records. Functions check current Admin Auth identity as well as claims. Lower-ranked staff cannot promote themselves or modify protected owners. Stored content is escaped and links validated.

Do not use the empty historical role utility scripts as a deployment step. Manage roles through the owner UI after callable deployment. Product documents are public: keep secrets/private admin information elsewhere. Client preferences do not establish authentication.

```powershell
npm test
npm run build
npm --prefix functions run build
npx firebase deploy --project ag-home-3db3f --only firestore:rules,functions
```

For GitHub Pages, push `master`: the workflow runs `npm run build:pages`, publishes the generated `gh-pages` branch and requests its Pages build. Use **Deploy from a branch → gh-pages → /(root)** as the Pages source. The optional `npm run deploy` command manually publishes a branch using your local Git credentials; use the workflow for the tested automatic path. Firebase deployment remains separate. Firebase Hosting uses `npm run build:hosting` to generate `hosting-dist/AG-Home/`, preserves the same asset paths, and redirects `/` to `/AG-Home/index.html`. Its configured predeploy builds that directory automatically. Deploy it separately with `npx firebase deploy --project ag-home-3db3f --only hosting`. Both hosts retain the existing `/AG-Home/` base and nine direct HTML routes.

Remove emulator overrides before a real deployment. This upgrade is locally tested; production has not been deployed, Console configuration has not changed, and no real emails or production data were modified. Frontend and Functions production dependency audits report no vulnerabilities. Three moderate development-only advisories remain in Firebase CLI's OpenTelemetry/PubSub chain; no high/critical advisories remain. Review `npm audit` before updating tooling. Patched FTP/UUID/watch dependencies are pinned/overridden; the emulator's directory watching is checked locally. Do not force npm's suggested CLI downgrade blindly.
