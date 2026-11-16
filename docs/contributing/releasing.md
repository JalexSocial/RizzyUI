# Releasing RizzyUI

The `RizzyUI` and `RizzyUI.Templates` NuGet packages and the `@jalexsocial/rizzyui` npm package are
released together with one version number by `.github/workflows/release.yml`, from a `vX.Y.Z` tag. Pull requests and
pushes to `main` never publish (they run `ci.yml`; the documentation site is deployed by `docs.yml`).

RizzyUI's version is independent of Rizzy's. The `RizzyUI` package declares which Rizzy version it
needs.

## RizzyUI.Tasks

`RizzyUI` depends on the `RizzyUI.Tasks` NuGet package (the MSBuild task behind Alpine
code-behind discovery). Its version is set in one place, `RizzyUITasksVersion` in
`src/Directory.Build.props`; `RizzyUI.Tasks.csproj` packs that version and `RizzyUI` and the docs
app reference it.

- Bump `RizzyUITasksVersion` whenever `src/RizzyUI.Tasks` changes. Never change what an already
  published version contains.
- Every release run packs `RizzyUI.Tasks` first, restores with that package as an extra source,
  and pushes it to nuget.org **before** `RizzyUI` only when nuget.org does not have that version.
  An unchanged version is skipped; `RizzyUI` itself is never pushed with `--skip-duplicate`.
- CI and the docs workflow pack it the same way, so a broken Tasks package fails CI and an
  unreleased Tasks version still builds. Locally, after bumping the version:
  ```bash
  bash eng/pack-tasks.sh ./artifacts/nupkgs
  ```
  ```bash
  dotnet restore src/RizzyUI.sln -p:RestoreAdditionalProjectSources="$PWD/artifacts/nupkgs"
  ```

## Checklist

1. **Changelog.** Rename `## [Unreleased]` in `CHANGELOG.md` to `## [X.Y.Z] - YYYY-MM-DD` and add a new
   empty `## [Unreleased]` above it. Every breaking change needs a migration note.
2. **Migration guide.** For a release that changes the Rizzy or htmx major version, check that
   `docs/migration/` covers every breaking change.
3. **Version.** Set `<Version>X.Y.Z</Version>` in `src/RizzyUI/RizzyUI.csproj`. The workflow refuses
   to publish when the tag and the project version differ. (The npm version is set from the tag.)
4. **Client assets.** `packages/rizzyui/dist` and `src/RizzyUI/wwwroot` must match a fresh
   `npm run build`; CI checks this.
5. **Merge** the release PR and wait for CI.
6. **Tag** the merge commit and push the tag, then approve the run in the `release` environment:
   ```bash
   git tag -a vX.Y.Z -m "RizzyUI X.Y.Z" && git push origin vX.Y.Z
   ```
   Versions with a pre-release suffix are published to npm under the `next` dist-tag and marked as
   pre-releases on GitHub.
7. **Check** the GitHub release, `dotnet add package RizzyUI --version X.Y.Z` in a fresh app,
   `npm view @jalexsocial/rizzyui dist-tags`, and the template:
   ```bash
   dotnet new install RizzyUI.Templates::X.Y.Z && dotnet new rizzyui -o TemplateCheck && cd TemplateCheck && dotnet run
   ```
8. **Bump** `<Version>` to the next development version (for example `X.Y.(Z+1)-dev`) so CI builds
   never carry a published version number.

## Recovering a partial release

The workflow publishes NuGet first (`RizzyUI.Tasks` when its version is new, then `RizzyUI`, then
`RizzyUI.Templates`), then npm, then the GitHub release. The template pins the npm version, so it
does not work until npm is published.

- **Failed before NuGet:** fix the cause and re-run. Nothing was published.
- **`RizzyUI.Tasks` published, `RizzyUI` failed:** fix the cause and re-run the tag. The run finds
  that Tasks version on nuget.org and skips it.
- **NuGet published, npm or the GitHub release failed:** run the workflow manually from `main` with
  the version and **npm only** ticked:
  ```bash
  gh workflow run release.yml --ref main -f version=X.Y.Z -f npm_only=true
  ```

## One-time setup (maintainers)

These steps need repository and registry owner rights; the workflow does not work until they are
done.

- **`release` environment** (Settings → Environments) with required reviewers, so a pushed tag
  waits for approval.
- **NuGet trusted publishing:** on nuget.org, add a Trusted Publishing policy for the account that
  owns `RizzyUI`, `RizzyUI.Tasks` **and** `RizzyUI.Templates` (the policy must cover all three packages): repository owner
  `JalexSocial`, repository `RizzyUI`, workflow `release.yml`, environment `release`. Add a **variable** `NUGET_USER` (the nuget.org profile name) to the
  `release` environment. Then delete the old `NUGET_API_KEY` secret and revoke that key.
- **npm trusted publishing:** on npmjs.com, `@jalexsocial/rizzyui` → Settings → Trusted Publisher →
  GitHub Actions: `JalexSocial` / `RizzyUI` / `release.yml` / `release`. Then delete the old
  `NPM_TOKEN` secret.
- **Pages:** the `github-pages` environment keeps deploying the docs site from `docs.yml`.
