# RizzyUI templates

Project templates for [RizzyUI](https://rizzyui.jalex.io).

```bash
dotnet new install RizzyUI.Templates
dotnet new rizzyui -o MyApp
cd MyApp
dotnet run
```

You need the .NET 10 SDK or later and Node.js 20 or later. The first build runs `npm install` and
compiles the app's Tailwind CSS.

## `dotnet new rizzyui`

An ASP.NET Core server-rendered app with:

- a collapsible sidebar layout with light and dark mode,
- a dashboard, a searchable and paged customer table, a validated settings form, and 404 and
  error pages,
- controllers (`RzController`) for pages and forms, and minimal API endpoints for htmx fragments,
- Tailwind CSS v4 built with npm, using RizzyUI's theme and plugin.

| Option | Values | Default |
|---|---|---|
| `-f`, `--framework` | `net10.0`, `net11.0` | `net10.0` |
| `--theme` | `Arctic`, `Vercel` | `Arctic` |
| `--no-restore` | (flag) Skip `dotnet restore` after creating the project | off |

The template pins the RizzyUI NuGet package and the `@jalexsocial/rizzyui` npm package to the
version of the template package.

## Working on the template

The starter app is in `content/RizzyUI.Starter`. Its package versions are the token
`RIZZYUI_VERSION`, which `RizzyUI.Templates.csproj` replaces with RizzyUI's `<Version>` (from
`src/RizzyUI/RizzyUI.csproj`) when it packs, so the folder does not build in place. To try a
change, pack and generate an app against locally packed RizzyUI packages:

```bash
bash eng/template-test.sh
```
