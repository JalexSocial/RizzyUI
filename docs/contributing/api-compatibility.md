# Public API compatibility

Two checks stop accidental breaking changes before they reach consumers. Both run in CI.

## 1. Package validation (`dotnet pack`)

`src/RizzyUI/RizzyUI.csproj` sets `EnablePackageValidation` and `PackageValidationBaselineVersion`.
Packing compares the public API of the new `RizzyUI` package with the baseline release on nuget.org
and fails on a removed or changed public type or member (for example `CP0002` when a component
property is renamed).

- After each release, set `PackageValidationBaselineVersion` to the version just released.
- To accept an intentional break, generate a suppression file and commit it with the change:
  ```bash
  dotnet pack src/RizzyUI/RizzyUI.csproj -c Release -p:ApiCompatGenerateSuppressionFile=true
  ```
  This writes `src/RizzyUI/CompatibilitySuppressions.xml`. Review it, list the break under
  "Breaking" in `CHANGELOG.md`, and add a migration note. Do not set
  `GenerateCompatibilitySuppressionFile` permanently: it suppresses every break silently.

## 2. Public contract baseline (`dotnet test`)

`src/RizzyUI.Tests/ApiBaseline/public-contract.txt` lists what package validation does not see:

- every component's public `[Parameter]` and `[CascadingParameter]` properties, with their types
  and `CaptureUnmatchedValues` / `[EditorRequired]`;
- every public enum and its values;
- the public properties of `RizzyUIConfig`;
- the services `AddRizzyUI()` registers, with their lifetimes.

`PublicContractTests` fails when the list changes. A property that loses `[Parameter]` keeps its
public signature, so package validation passes, but markup that sets it stops compiling; this test
catches it.

When a change is intentional (a new parameter, a new enum value), regenerate the file and review the
diff in the pull request:

```bash
RIZZYUI_UPDATE_API_BASELINE=1 dotnet test src/RizzyUI.Tests --filter PublicContractTests
```

In PowerShell:

```powershell
$env:RIZZYUI_UPDATE_API_BASELINE = "1"; dotnet test src/RizzyUI.Tests --filter PublicContractTests; Remove-Item Env:RIZZYUI_UPDATE_API_BASELINE
```

Added lines are compatible. Removed or changed lines are breaking: list them under "Breaking" in
`CHANGELOG.md` with a migration note.
