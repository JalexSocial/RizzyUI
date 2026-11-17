# RizzyUI.Starter

An ASP.NET Core app built with [RizzyUI](https://rizzyui.jalex.io): server-rendered Razor
components, Tailwind CSS v4, Alpine.js and htmx 4. Created with `dotnet new rizzyui`.

## Run it

You need the .NET SDK and Node.js 20 or later.

```bash
dotnet run
```

The first build runs `npm install`. Every build compiles `Styles/app.css` to `wwwroot/css/app.css`
with Tailwind. While you edit markup, keep Tailwind watching in a second terminal so new classes
appear without a rebuild:

```bash
npm run watch:css
```

## What's inside

| Path | What it does |
|---|---|
| `Program.cs` | Registers Rizzy and RizzyUI, maps controllers and the fragment endpoints. |
| `Components/Layout/AppLayout.razor` | The HTML document: head, scripts, theme provider. |
| `Components/Layout/MainLayout.razor` | The page shell: sidebar, header and content area. |
| `Components/Layout/AppSidebar.razor` | The sidebar navigation. Add your pages to `Items`. |
| `Features/Home` | The dashboard. `HomeController` returns it with `View<Dashboard>()`. |
| `Features/Customers` | A searchable, paged table. The search box and pager fetch only the table from `CustomersController.Table`, which returns `PartialView<CustomerTable>()`. |
| `Features/Settings` | A validated form posted with htmx. Invalid input returns status 422 with the errors. |
| `Features/Activity` | Minimal API endpoints (`MapGroup("/fragments")`) that return htmx fragments through `IRizzyService`. |
| `Features/Errors` | The 404 and error pages. |
| `Styles/app.css` | The Tailwind entry point. It imports RizzyUI's theme and plugin from npm. |

## How pages and fragments work

- A **page** is a Razor component returned by a controller action with `View<T>()`. Rizzy wraps it
  in `MainLayout` for normal requests and boosted navigation (`hx-boost` on `<body>`).
- A **fragment** is a component returned with `PartialView<T>()` (controllers) or
  `IRizzyService.PartialView<T>()` (minimal APIs). htmx swaps it into the element named by
  `hx-target`.
- **Forms** post with `hx-post`. Controller actions use `[ValidateAntiForgeryToken]`; the token
  is added to htmx requests for you. On validation errors, call `Response.Htmx().ValidationFailed()`
  and return the form again.

## Next steps

- Add a page: create `Features/<Name>/<Name>Controller.cs` and a component, then add it to the
  sidebar in `AppSidebar.razor`.
- Change the theme in `Program.cs` (`config.DefaultTheme`).
- Browse the components at <https://rizzyui.jalex.io>.
- htmx loads from jsDelivr with subresource integrity. To serve it yourself or add a Content
  Security Policy, see the Rizzy and RizzyUI docs.
