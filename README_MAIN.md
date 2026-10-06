# AG Home documentation

The main, maintained project guide is [README.md](README.md).

AG Home is AG's Vite/Firebase business website: public database-driven products, Team history and organization map, verified authentication, Settings, contact/feedback and a focused staff Control Panel.

## Start locally

Use Node 24 (also recorded in `.nvmrc`). Cloud Functions target Node 22.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:5173/AG-Home/`. Empty Firebase overrides use the existing AG public web configuration. Install backend dependencies with `npm --prefix functions ci` when working with Functions/emulators.

## Publish

Keep **master** as the default branch. Select **Settings → Pages → Source: Deploy from a branch → gh-pages → /(root)** once, then push `master`. The workflow tests and builds the app, creates/updates `gh-pages` and explicitly requests its Pages build. GitHub's separate **pages build and deployment** run reports the final publishing result. Keep the repository name `AG-Home`; its routes use `/AG-Home/`.

No personal deployment token or mandatory new Firebase secrets are required. Firebase backend deployment and authorized-domain/email-action configuration remain separate administrator tasks.

## Documentation

| Guide | Content |
| --- | --- |
| [README.md](README.md) | Current features, setup, Firebase, models, localization, character and security |
| [DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md) | Push-to-publish setup, commands, Pages and Firebase recovery |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Existing architecture and shared data contracts |
| [TESTING.md](TESTING.md) | Completed local checks and remaining live-service checks |
| [.env.example](.env.example) | Safe public frontend configuration overrides |
| [functions/.env.example](functions/.env.example) | Backend configuration template |
| [Emails/](Emails/) | Separate Firebase email-copy source templates |

Runtime dependency versions come from the committed package files and lockfiles. This guide does not assert live deployment, SMS/push delivery or Console configuration that has not been verified.
