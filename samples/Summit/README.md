# Summit

Summit is a fictional developer-conference platform built with RizzyUI, Rizzy 6 and htmx 4: a public
site (schedule, speakers, tickets, help) and an organizer area (dashboard, attendees, check-in desk,
schedule builder, settings). It exists to show what RizzyUI looks like in a real application, and to
test the library end to end: CI runs its browser tests on every pull request, under the standard and
the strict-CSP build, against the packed packages.

- Plan: [docs/engineering/summit-demo-plan.md](../../docs/engineering/summit-demo-plan.md)
- What building it turned up (bugs, gaps, rough edges): [docs/engineering/summit-findings.md](../../docs/engineering/summit-findings.md)

Every person, company, place and image in Summit is made up. The images were generated for this
project.

## Run it

Requirements: the .NET 10 SDK and Node.js 22 or later. From the repository root:

```powershell
dotnet run --project samples/Summit/src/Summit.Web --launch-profile http
```

The first build installs npm packages and builds the Tailwind CSS. Open http://localhost:5260.

The same app in strict-CSP mode (nonce-based policy, RizzyUI's CSP build) runs on port 5261:

```powershell
dotnet run --project samples/Summit/src/Summit.Web --launch-profile csp
```

### Organizer sign-in

In Development the sign-in page shows the demo account: `organizer@summit.test`, password
`summit-demo-2027` (set in `appsettings.Development.json`; it is a test value, not a secret).

### Data

The SQLite database in `src/Summit.Web/App_Data` is rebuilt from a deterministic seed on every start
(`Summit:Database:ResetOnStart`). The conference always starts the day after "now".

## Configuration

| Key | Default | What it does |
|---|---|---|
| `Summit:Csp:Enabled` | `false` | Strict nonce CSP header and `rizzyui-csp.js` |
| `Summit:EnableTestHooks` | `false` | `/_test/reset` and `/_test/fail-next` for the browser tests |
| `Summit:Database:Path` | `App_Data/summit.db` | SQLite file |
| `Summit:Database:ResetOnStart` | `true` | Rebuild the database from the seed on startup |
| `Summit:FixedNow` | unset | A fixed clock (the Testing environment uses one) |
| `Summit:CheckIn:PollSeconds` | `5` | Check-in desk polling interval |
| `Summit:Assets:UseCdnDefaults` | `false` | Load widget libraries from RizzyUI's CDN defaults instead of `wwwroot/lib` |

## How it references RizzyUI

`SummitRizzyUISource` (in `Directory.Build.props`) picks the source:

- `Project` (default): `src/RizzyUI` from this repository, and the npm package from `packages/rizzyui`.
- `Package`: the `RizzyUI` NuGet package at `$(RizzyUIVersion)` and the packed npm tarball. CI and
  the release workflow use this with freshly packed packages: `eng/summit-test.sh` publishes Summit in
  `Release`, checks the publish output (bundled code-behind modules, compressed assets, no npm files),
  starts two published servers in `Production` with the test hooks on, and runs the browser suite
  against them. Package builds use `obj-package/` and `bin-package/`, so switching modes never mixes
  restores.

To run it locally (Git Bash), pack first, then pass the folder, the version and the tarball:

```bash
bash eng/summit-test.sh ./artifacts/nupkgs 1.0.0-preview.4-dev-ci.local.1 ./artifacts/npm/jalexsocial-rizzyui-1.0.0-preview.4-dev-ci.local.1.tgz
```

The CI job's "Pack RizzyUI" step shows the pack commands.

## Tests

HTTP-level tests (seeding, status codes, htmx headers, CSP, sign-in):

```powershell
dotnet test samples/Summit/Summit.slnx
```

Browser tests (Playwright and axe). Build first; the test run starts two servers itself, on ports
5270 (standard) and 5271 (CSP), in the `Testing` environment:

```powershell
dotnet build samples/Summit/Summit.slnx
```

```powershell
npm --prefix samples/Summit/tests/e2e ci
```

```powershell
npm --prefix samples/Summit/tests/e2e test
```

Projects: `standard`, `csp` and `mobile` (specs tagged `@mobile`, at Pixel 7 size). To run one:

```powershell
npm --prefix samples/Summit/tests/e2e test -- --project=csp
```

The suite never retries. A test that fails intermittently is a bug to fix. The quarantine process:

1. Reproduce it locally with `--repeat-each=10` on the failing project; most "flakes" so far were a
   real race (typing before a lazily loaded component had focus, a locator that matched another
   component's list) and were fixed in the test or recorded as a finding.
2. If it cannot be fixed the same day, mark it `test.fixme(true, 'quarantined: <issue link>')`. It stays
   in the report as skipped, with the reason, instead of hiding behind a retry.
3. Fix it or delete it within a week; a quarantined test does not count toward the coverage matrix.

Known library defects are not skipped: a test either works around them in the app (and says so with
the finding id) or reports them as annotations (`expectUniqueIds`).

Unit tests for the Alpine code-behind modules:

```powershell
npm --prefix samples/Summit/src/Summit.Web test
```
