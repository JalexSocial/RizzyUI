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
- `Package`: the `RizzyUI` NuGet package at `$(RizzyUIVersion)`. CI uses this with freshly packed
  packages (`eng/summit-test.sh`).

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

The suite never retries. A test that fails intermittently is a bug to fix, or to mark `test.fixme`
with an issue link while it is investigated.

Unit tests for the Alpine code-behind modules:

```powershell
npm --prefix samples/Summit/src/Summit.Web test
```
