<img src="https://jalexsocial.github.io/Rizzy/media/rizzy-logo.png?cache=bust3" width="600"/>

# RizzyUI: Modern UI Composition for ASP.NET SSR 

<div align="center">

[![NuGet](https://img.shields.io/nuget/v/RizzyUI.svg)](https://www.nuget.org/packages/RizzyUI)
[![npm](https://img.shields.io/npm/v/@jalexsocial/rizzyui.svg)](https://www.npmjs.com/package/@jalexsocial/rizzyui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

</div>

**Composable SSR UI for ASP.NET Core - no WASM runtime, no SignalR circuit, no SPA rewrite.**

If you like MVC or Razor Pages because they’re explicit, stateless, and easy to debug, RizzyUI keeps that model and modernizes the **view layer**:

* **SSR Razor Components** for composition
* **Tailwind CSS v4** for styling
* **Alpine.js** for local interactivity
* **HTMX** for hypermedia-driven updates

RizzyUI runs in the normal ASP.NET Core request/response lifecycle. You can **View Source**, set breakpoints, and reason about what happened.

## Documentation Site

For detailed documentation and examples, please visit the [Rizzy Documentation Site](https://jalexsocial.github.io/rizzy.docs/).  You can find a demo of all components along with documentation of RizzyUI at the [RizzyUI Component Documentation](https://rizzyui.jalex.io/) site.

---

## Who this is for

RizzyUI is a good fit if you want **component reuse** without switching to a SPA.

* **ASP.NET Core teams** that want a modern component model but still want SSR.
* **MVC/Razor Pages apps** suffering from partial-view sprawl, global JS, and CSS leakage.
* **SSR-first projects** where SEO, initial render, and debuggability matter.

### Not a fit for

* **Offline-first** applications that depend on heavy client-side sync/storage.
* **Ultra high-frequency real-time** experiences where WebSockets/streaming is the product.
* **Teams avoiding Tailwind**—RizzyUI is Tailwind-first.

---

## Tech stack (what you’re actually using)

RizzyUI is not a new platform. It’s a set of components + conventions built on common web primitives.

* **Structure:** Razor Components (C#) — SSR only
* **Styling:** Tailwind CSS v4
* **Interactivity:** Alpine.js
* **Updates:** HTMX (HTML fragments over HTTP)

---

## Installation

You install:

1. the **.NET package** (components + server integration), and
2. the **NPM package** (client-side assets and build pipeline).

### 1) Install packages

```bash
dotnet add package RizzyUI
npm install @jalexsocial/rizzyui
npm install -D tailwindcss @tailwindcss/cli
```

### 2) Register services + middleware

In `Program.cs`:

```csharp
using RizzyUI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRizzyUI(config =>
{
    config.DefaultTheme = RzTheme.ArcticTheme;
});

var app = builder.Build();

app.UseRizzy();

app.Run();
```

### 3) Wire up the document head

In `App.razor` (or your main layout):

```razor
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Your compiled Tailwind CSS -->
    <link rel="stylesheet" href="app.css" />

    <!-- RizzyUI scripts/metadata -->
    <RzHeadOutlet />

    <!-- Theme provider (CSS variables) -->
    <RzThemeProvider />
</head>
<body>
    <Routes />
</body>
</html>
```

---

## The shift: component-driven SSR (without changing your architecture)

RizzyUI isn’t asking you to replatform. It’s a better way to compose views.

### Before: partials + global JS

Partials tend to leak styling and force manual ID management for JS.

```html
<!-- _UserCard.cshtml -->
<div class="card @ViewData["Classes"]" id="card-@Model.Id">
  <h3>@Model.Name</h3>
  <button onclick="toggleDetails(@Model.Id)">Toggle</button>
  <div id="details-@Model.Id" style="display:none;">...</div>
</div>
```

### After: components + local state

You get encapsulated markup, typed parameters, and scoped behavior via Alpine.

```razor
// UserCard.razor
<RzCard class="w-[350px]">
    <CardHeader>
        <CardTitle>@User.Name</CardTitle>
    </CardHeader>
    <CardContent>
        <div x-data="{ open: false }">
            <RzButton x-on:click="open = !open" Variant="ThemeVariant.Outline">
                Toggle Details
            </RzButton>
            <div x-show="open" x-collapse>
                <p>@User.Email</p>
            </div>
        </div>
    </CardContent>
</RzCard>

@code {
    [Parameter] public UserData User { get; set; } = default!;
}
```

---

## Advanced: the Alpine “code-behind” pattern

Inline Alpine strings (`x-on:click="..."`) are great until they aren’t. For more complex behavior, RizzyUI supports a **code-behind** approach:

* your JS lives next to the component
* RizzyUI handles bundling/registration
* CSP nonces are handled automatically

**1) Component** (`Counter.razor`)

```razor
@attribute [RzAlpineCodeBehind]

<RzAlpineComponent For="this" Name="counter" AsChild>
    <div class="flex gap-4">
        <span x-text="count"></span>
        <button x-on:click="increment">Increment</button>
    </div>
</RzAlpineComponent>
```

**2) Logic** (`Counter.razor.js`)

```javascript
export default () => ({
    count: 0,
    increment() {
        this.count++;
    }
});
```

---

## Tradeoffs (honest costs)

RizzyUI is intentionally “boring tech,” but there are still costs:

* **Build tooling:** Tailwind implies Node.js + a build step.
* **Logic near markup:** Alpine keeps things local, but you’ll want conventions to avoid messy templates.
* **Hypermedia mindset:** HTMX shines when you’re comfortable returning HTML fragments, not just full pages.

---

## License

RizzyUI is licensed under the [MIT License](LICENSE.md).
