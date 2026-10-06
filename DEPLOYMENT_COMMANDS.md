# AG Home: push-to-publish deployment

Repository: https://github.com/AG-Alien-Gamerz/AG-Home

Website: https://ag-alien-gamerz.github.io/AG-Home/

## One-time repository setup

1. Create/use your GitHub repository named **AG-Home** and set your source branch (`master`, `main` or another branch) as its default branch.
2. Under **Settings → Actions → General**, allow GitHub Actions and the actions used by `.github/workflows/deploy.yml`. The workflow requests `contents: write` for its branch-publishing job; repository/organization policy must permit it. No personal token is required.
3. Under **Settings → Pages → Build and deployment**, select **Source: GitHub Actions**. This workflow also saves the built site in `gh-pages`, but deploys the artifact explicitly: a `GITHUB_TOKEN` branch push does not trigger another Pages build. [GitHub documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
4. If the `github-pages` environment requires reviewers, deployment waits for that configured approval. For unattended deployment, configure that environment accordingly. Branch restrictions must allow the default source branch.
5. In Firebase Auth → Settings → Authorized domains, add `ag-alien-gamerz.github.io`. Set the email-template action URL to `https://ag-alien-gamerz.github.io/AG-Home/auth-action.html`. Keep existing domains you still use.

GitHub Pages availability depends on repository visibility and your GitHub plan. The Actions run and Settings → Pages display the actual published URL; do not copy a former account's address.

## Commit and push

The local checkout may not have an `origin` remote yet. Check first:

```powershell
git remote -v
git branch --show-current
```

If no `origin` exists, add **your real repository URL**, replacing this example:

```powershell
git remote add origin https://github.com/AG-Alien-Gamerz/AG-Home.git
```

If `origin` already exists, verify it points to the intended account; change it only if needed with `git remote set-url origin <actual-url>`.

Check the build before pushing:

```powershell
npm ci
npm test
npm run build:pages
git status --short
git add .
git commit -m "Configure AG Home automatic Pages deployment"
git push -u origin master
```

Use your actual default branch in the last command if it is not `master`. If the commit already exists, push it without creating a duplicate commit. Do not force-push over remote history; reconcile any rejected push normally.

The optional `bash deploy.sh` helper checks the build and offers to commit/push the current source branch. The direct Git commands are sufficient.

## What each push does

`.github/workflows/deploy.yml` publishes only the repository's default branch. It:

1. Checks out source and installs the committed dependency lockfile with Node 24.
2. Runs unit tests.
3. Builds `dist/` with emulators disabled and verifies the nine application pages, public assets, manifest and `/AG-Home/` links.
4. Creates or updates **gh-pages**, containing only the generated site plus `.nojekyll`. Old generated files are replaced so removed assets do not accumulate. Treat this branch as generated output.
5. Uploads that same build and explicitly deploys it through GitHub Pages.

Default-branch pushes and manual runs deploy; feature-branch and `gh-pages` pushes do not publish. In Actions, choose **Deploy to GitHub Pages → Run workflow** on the default branch to retry. The resulting deployment URL appears on the successful run.

## Firebase build configuration

The existing public AG Firebase configuration is the default. No new secrets are required just to build/publish this site. Optional repository **Variables** under Settings → Secrets and variables → Actions override it:

- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`, `VITE_FIREBASE_VAPID_KEY`, `VITE_FUNCTIONS_REGION`
- `VITE_ENABLE_TOTP_MFA=true` only after the actual Identity Platform provider is configured.

Existing repository secrets with the same Firebase/region names still work; Variables take precedence. `VITE_*` values appear in public JavaScript. Never supply a service-account key or backend token in these variables. `.env`, `.env.production`, Functions project/local environment files, dependencies, build output and test artifacts are ignored; both `.env.example` templates remain versioned. The workflow builds from committed source, not local environment files.

## Backend deployment is separate

Pages hosts HTML/CSS/JavaScript and assets. It cannot deploy Firebase Functions/rules or configure providers/billing/templates. A Firebase administrator deploys those separately:

```powershell
npm --prefix functions ci
npm --prefix functions run build
npx firebase login
npx firebase deploy --project ag-home-3db3f --only firestore:rules,functions
```

Use the actual Functions environment described in README; privileged credentials remain on the backend. Configure real OAuth credentials, phone billing/regions, email action URLs and Web Push/TOTP requirements as appropriate. Products are read only from Firestore; an empty database produces an empty catalogue.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No workflow runs | Workflow is committed; Actions enabled; pushed branch is the repository's default |
| `gh-pages` push denied | Repository/organization Actions permissions and branch protection permit generated branch updates |
| Branch exists but Pages deployment fails | Pages Source is **GitHub Actions**; inspect environment restrictions and Pages availability |
| Missing logo/CSS or broken routes | Repository name/base is **AG-Home**; `npm run build:pages` passes; nine HTML files are published at branch root |
| Login fails after moving accounts | Add the actual Pages domain to Firebase Auth; check real provider settings |
| Emails open the old handler | Set Firebase template action URL to the actual Pages `auth-action.html`, then request a new email |
| Empty products | Verify real `products` records and public-read rules; there is no hardcoded fallback |
| Report/chat/management fails | Verify deployed Firebase Functions/rules; static deployment alone does not create the backend |
| New version is not visible | Wait for the current run to finish, inspect the deployment URL, then refresh cached tabs |

All nine application pages are real files and support direct URLs; this is not an SPA requiring arbitrary unknown paths to redirect to index. Production deployment can only be verified after a successful remote Actions run and live-service checks.
