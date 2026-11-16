# Developing RizzyUI

## Branches, commits and pull requests

- `main` is the only long-lived branch. Every change reaches it through a reviewed pull request,
  and CI (`.github/workflows/ci.yml`) must pass first.
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`fix:`, `feat:`,
  `docs:`, `test:`, `chore:`, `ci:` ...). Mark breaking changes with `!` and describe them in
  `CHANGELOG.md` under `## [Unreleased]` → `### Breaking`, with a migration note.
- Component work follows [AGENTS.md](../../AGENTS.md) and `docs/agents/`.

## Requirements

- .NET 10 SDK (`global.json` pins the 10.0 feature band)
- Node.js 22
- Python 3 (package checks)
- Chromium for Playwright (`npx playwright install chromium` in `src/RizzyUI.Docs`), or Chrome on Windows

## Build and test (what CI runs)

Client assets. `packages/rizzyui/dist` and `src/RizzyUI/wwwroot` are **committed build output** and
are what the packages ship; `dotnet build` does not rebuild them. Rebuild and commit them whenever
you change `packages/rizzyui/src`; CI fails if they differ from a fresh build.

```bash
cd packages/rizzyui && npm ci && npm test && npm run build
```

.NET build and tests. If you changed `RizzyUITasksVersion` in `src/Directory.Build.props` (because
`src/RizzyUI.Tasks` changed), that version is not on nuget.org yet, so first pack it and restore
from the local folder (see [releasing.md](releasing.md#rizzyuitasks)):

```bash
bash eng/pack-tasks.sh ./artifacts/nupkgs
```

```bash
dotnet restore src/RizzyUI.sln -p:RestoreAdditionalProjectSources="$PWD/artifacts/nupkgs"
```

Then:

```bash
dotnet build src/RizzyUI.sln -c Release
```

```bash
dotnet test src/RizzyUI.sln -c Release --no-build
```

Accessibility inventory:

```bash
cd src/RizzyUI && npm ci && npm test && npm run check-accessibility-inventory
```

Browser tests. Build the docs app in **Debug** first: a Release build of the docs app generates
the static site and exits on startup.

```bash
dotnet build src/RizzyUI.Docs -c Debug
```

```bash
cd src/RizzyUI.Docs && npm ci && npm run test:a11y && npm run test:integration
```

- `test:a11y` runs the keyboard/focus/axe contracts against hand-written fixture pages
  (`wwwroot/accessibility-*.html`).
- `test:integration` starts the docs app and tests real component output with htmx 4, Rizzy 6 and
  the RizzyUI runtime (`tests/integration/`). Add a scenario here when you change runtime behavior.

Packages, checked the way consumers get them (the checker also verifies the `RizzyUI.Tasks`
package when it is in the folder):

```bash
bash eng/pack-tasks.sh ./artifacts/nupkgs
```

```bash
dotnet pack src/RizzyUI/RizzyUI.csproj -c Release -p:Version=0.0.0-local.1 -o ./artifacts/nupkgs
```

```bash
dotnet pack templates/RizzyUI.Templates.csproj -c Release -p:RizzyUIVersion=0.0.0-local.1 -o ./artifacts/nupkgs
```

```bash
cd packages/rizzyui && npm pack --pack-destination ../../artifacts/npm && cd ../..
```

```bash
python eng/check-package-contents.py ./artifacts/nupkgs ./artifacts/npm/jalexsocial-rizzyui-*.tgz
```

```bash
bash eng/consumer-smoke-test.sh ./artifacts/nupkgs 0.0.0-local.1 ./artifacts/npm/jalexsocial-rizzyui-*.tgz
```

```bash
bash eng/template-test.sh ./artifacts/nupkgs 0.0.0-local.1 ./artifacts/npm/jalexsocial-rizzyui-*.tgz net10.0 net11.0
```

Use a version that is not published (as above), so the smoke and template tests cannot resolve a
package from nuget.org instead of your local one.

The `dotnet new rizzyui` starter app lives in `templates/content/RizzyUI.Starter`. Its package
versions are the `RIZZYUI_VERSION` token, replaced when the template is packed, so the folder does
not build in place: change it, pack, and run `eng/template-test.sh` (see `templates/README.md`).

## htmx checks

Run the official checker on Razor files after changing htmx markup (on Windows set
`PYTHONIOENCODING=utf-8` first):

```bash
npx -p htmx.org@4 upgrade-check --ext .razor --ext .cs src/RizzyUI src/RizzyUI.Docs/Components
```

It cannot see attribute values built at runtime; the integration tests cover those paths.

## Documentation

- Component usage: the docs app (`src/RizzyUI.Docs`), as required by AGENTS.md.
- Consumer migration guides: `docs/migration/`.
- Engineering references: `docs/engineering/`.
- Technical audits: `docs/audits/` (see its README for the conventions).
- Framework-level documentation lives in the separate `rizzy.docs` repository.
