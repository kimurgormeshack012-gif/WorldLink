# WorldLink — Android APK build

This repository root must contain `package.json`, `app.json`, `eas.json`, and `App.js`.
The workflow is `.github/workflows/main.yml`. Do not put the app files inside a second
`WorldLink/` directory; the workflow runs from the repository root.

## One-time setup

1. Create an Expo account and create an Expo access token.
2. In GitHub, open this repository → Settings → Secrets and variables → Actions.
3. Add a repository secret named `EXPO_TOKEN` with the Expo token as its value.
4. Ensure GitHub Actions are enabled and workflow permissions allow actions to run.
5. Commit all files in this package to the repository's `main` branch.
6. Open Actions → Build WorldLink APK → Run workflow → select `main`.

The workflow uses EAS cloud build. It first links the project to the Expo account,
then runs the `preview` profile, which is configured to produce an installable APK.
The build log will show the EAS build details URL. Download the APK from that build page
when the status is finished.

## Project files

- `App.js`: WorldLink React Native demo UI (including local-only report/block controls).
- `app.json`: Expo app identity and Android package `com.worldlink.social`.
- `package.json`: Expo SDK 58 / React 19.3 / React Native 0.88 dependencies.
- `eas.json`: `preview` creates APK; `production` creates AAB.
- `.github/workflows/main.yml`: GitHub Actions → EAS cloud build.
- `backend/supabase_schema.sql`: saved starter database schema; not connected to this demo app yet.

## Important product status

This is still a demo. Registration and login do not authenticate, posts are local-only,
messages are previews, and reports are not sent to a moderation team. A successful APK
build only proves the app can be packaged; it does not make these features production-ready.
Before public release, connect and test a real backend, implement server-side moderation
and reporting, and complete privacy/security testing. Never put service-role keys or
other private credentials in the app or repository.
