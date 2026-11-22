# Changelog

All notable changes to the `RizzyUI` and `RizzyUI.Templates` NuGet packages and the
`@jalexsocial/rizzyui` npm package are recorded here. The packages are released together, with one
version number, from a `vX.Y.Z`
git tag (see [docs/contributing/releasing.md](docs/contributing/releasing.md)).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and RizzyUI uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Breaking changes are listed under
"Breaking" with a migration note. Pre-release versions may change between previews.

RizzyUI's version is independent of Rizzy's. The first Rizzy 6 release is `1.0.0-preview.1`;
0.9.x is the last Rizzy 5 / htmx 2 line. Between releases the project version is the next release
with a `-dev` suffix (now `1.0.0-preview.4-dev`), and CI packages append `-ci.<run>.<attempt>`.

Finding IDs (RZUI-0xx) refer to the
[2026-11-15 initial audit](docs/audits/2026-11-15-rizzyui-initial-audit/00-executive-summary.md).

## [Unreleased]

### Breaking

- **`RzDateEdit` has no default accessible name** (Summit SF-068). Its input had `aria-label="Select date"`, which screen readers announced instead of the field's `FieldLabel`, and the wrapper was a group labelled "Date picker". A labelled field now gets its name from the label. Migration: set the new `AriaLabel` parameter on a date field without a visible label.
- **Alpine directive rules on components** (decisions D-24 and D-27). `x-data`, `x-init` and `x-load` passed to a RizzyUI component throw a descriptive exception instead of being silently replaced: put application state on an ancestor element. `x-model` throws on components without a model value (form inputs, input-group inputs, `CommandInput` and `RzColorSwatch` accept it); `x-show`, `x-cloak` and `x-transition` throw on components that manage their own visibility (overlay and collapsible content); `x-ref` throws for the ref names a component uses itself; an `x-bind` of an attribute the component computes (for example `aria-pressed` on `RzToggle`) is dropped with a Development warning. Migration: move `x-data` to a wrapper element (`<span x-data class="contents">`), and use `x-syncprop` or the component's events instead of `x-model`. See the new docs page "Parent Property Synchronization".
- **An `AsChild` child cannot declare its own Alpine scope** (decision D-25). `x-data`, `x-init` or `x-load` on the child of an `AsChild` component (element, component or markup child) throws a descriptive exception; the component puts its behavior on the child, and the child's scope used to replace it silently. A component's own `x-data` forwarded to a component child (`<RzClipboard AsChild><RzButton>`) is still allowed.
- **Every input posts the model path** (decision D-28, Summit SF-009). `RzCheckboxGroup`, `RzRadioGroup`, `RzCombobox`, `RzFileInput` and `RzInputOTP` posted the bare property name (`Country`) while Blazor-based inputs posted `Model.Country`, so in one form half the fields did not bind with `[SupplyParameterFromForm]` or `[FromForm(Name = "Model")]`. They now post the model path. Migration: actions that bind those fields by bare name (simple parameters, a differently named model, unprefixed minimal API `[FromForm]`) either bind the model with its prefix or set `Name="Country"` on the component.

### Added

- **`ChartBuilder.Type(...)`** sets a chart's type; without it `RzChart` uses the first dataset's type (Summit SF-059).
- **`<RzThemeHeadOutlet />`** renders the theme of `RzThemeProvider` in `<head>` (Summit SF-034). Place it next to `<RzHeadOutlet />` when `RzThemeProvider` wraps the page body; the starter template does.
- **`RzButton AsChild`** (Summit SF-018): renders its single child, typically `<a href>`, with the button's styling and attributes instead of a `<button>`. Before, `AsChild` became an unknown attribute and the link was nested inside a button (invalid, two tab stops); the starter template's 404 page did this.
- **`RzToastProvider ServerErrorToasts`** (Summit SF-041): shows a localized error toast when an htmx request fails, for Rizzy's `rz:server-error` (a 5xx that `UseHtmxErrorHandling` did not swap) and htmx's `htmx:error` (the request could not be sent). Without it, every app needed its own listener, or the user saw nothing. The messages can be set with `ServerErrorTitle`, `ServerErrorText` and `NetworkErrorText`.
- **`rz:toggle:change` and `RzToggle Name`/`Value`** (Summit SF-015, SF-030; decision D-24): the toggle reports its pressed state with a bubbling event and can post a value while pressed.
- **`rz:menubar:checked-change`** (Summit SF-067): menubar checkbox and radio items report changes with `{ type, value, checked, group }`, on the item and on the menubar element (the menu content is teleported). `MenubarCheckboxItem` gains `Value`. The events are declared in `rizzyui.d.ts`.
- **`RzGetForm`** (Summit SF-028): a GET form for searches and filters that RizzyUI's inputs work in, without `EditForm`'s antiforgery token and `_handler` field in the query string.
- **`RzFocusFirstInvalid`** (Summit SF-045): placed in a form, focuses the first invalid field when the form renders with validation errors (after a 422 swap), including composite controls.
- **`RzInputSlider<TValue>`** (Summit SF-070): a single-value slider bound to a numeric model property with `For`, posting the model path like the other inputs.
- **`RzInputOTP InputAttributes`** (Summit SF-064): attributes for the real input, such as `autofocus` (htmx 4 honors it after a swap).
- **Sheet events** (Summit SF-002, SF-032): `RzSheet` takes `EventTriggerName`, `CloseEventName` (default `rz:sheet-close`) and `InitialFocus`, and dispatches `rz:sheet:open` and `rz:sheet:close`; `RzDialog` takes `InitialFocus`.
- **`RzCalendarProvider` is a form field** (decision D-32, Summit SF-058): `Name` for single and multiple selection, `StartName`/`EndName` for ranges; it renders hidden inputs that follow its dates and raises a bubbling `change` when the value is complete, so `hx-trigger="change"` sends a date-range filter without script.
- **`CommandItem.Href`** (Summit SF-016): an item that navigates when chosen, like a boosted link; data items take `href` (`ICommandItemData.Href`, default `null`).
- **`RzCommandDialog` remote items and `Shortcut`** (Summit SF-007): `ItemsUrl`, `FetchTrigger` and `ServerFiltering` reach the inner `RzCommand`; `Shortcut="k"` opens the dialog with Ctrl+K / Cmd+K.
- **`RzAlertLiveRegionMode.None`** (Summit SF-022) for static callouts; **`RzCheckboxGroup.LegendVisible`** and a legend from `[Display(Name)]` (SF-029); **`RzAvatar.Decorative`** (SF-031); **`SidebarGroup.AriaLabel`** (SF-075).
- **`RzCollapsible.AsChild`** (Summit SF-080): the collapsible's behavior goes on its child, so `<RzCollapsible AsChild><SidebarMenuItem>` keeps a sidebar menu a list of items.
- **`RizzyUIConfig.LocalAssetPath` and `RizzyUIAssets.Vendor`** (Summit SF-012): serve the widget libraries (Chart.js, Tom Select, flatpickr, vanilla-calendar-pro, Coloris, Embla, rough-notation) from your own site, in jsDelivr's `{package}@{version}/{file}` layout, with the same integrity hashes.
- **Events sent before a component starts are kept** (Summit SF-039): a dialog's or sheet's `EventTriggerName` event that arrives while its code is still loading opens it once it starts. `Rizzy.componentsReady()` and the `rz:ready` document event tell tests and apps when the page's components have started.
- **`RzDataTable` state transport** (decision D-31, Summit SF-001): `StateInputName` keeps a hidden input with the table's sorting, page, filters and column visibility (and, with `IncludeSelectionInState`, the selection) as versioned JSON; bind it as `RzDataTableState` and rebuild the table from `ToInitialState()` so it keeps the user's place.
- **`RzTable.AriaLabel`** (Summit SF-063): the scroll container is focusable for keyboard scrolling, and a named region with `AriaLabel`.
- **`DataTableHeaderRows` and `DataTableBodyRows`** (Summit SF-056): helpers that write a DataTable's standard header and body rows (sorting, selection, flex rendering) while the table stays headless; the docs also explain the row objects in templates (SF-050).

### Changed

- **`RzChart` sizing** (Summit SF-061): the chart fills the height of a parent that has one instead of overflowing it, and is 2:1 (width to height) in a parent without a height; the fixed `min-h-[300px]` is gone. Set a height class on the chart or its parent for another size.
- **Date components follow the request culture** (Summit SF-073). `RzCalendar`, `RzCalendarProvider` and `RzDateEdit` default to `CultureInfo.CurrentCulture` instead of English; `RzDateEdit` loads flatpickr's locale file for it (65 languages, registered as assets `FlatpickrLocale.{file}` with SRI hashes, for example `FlatpickrLocale.de`, so they can be self-hosted). Set `Locale` in the options to keep a fixed language. `VanillaCalendarOptions.Locale` is now `string?` (null means the request culture).
- **`DataTableSortToggle` is named by its label** (Summit SF-053). Every sort button was named "Sort ascending", leaving out the column and hiding its visible text (WCAG 2.5.3); it is now named by its content, with the direction on the header's `aria-sort`. An icon-only toggle gets the column name from the new `sort.columnName(header)`; `sort.nextLabel(header)` is no longer the button's name.
- **A caller's `x-on:*` runs alongside the component's own handler** (decision D-24, Summit SF-030, SF-069). It was silently replaced when the component used the same event (`RzToggle`, `MenubarItem`); it now renders as Alpine's `@event` form, which Alpine binds as a separate listener.
- **`x-syncprop` on RizzyUI components** (decision D-24). On a component root without its own state (`RzSlider`, `RzChart`, ...) the directive moves to the element that holds the component's state, and "parent" is the nearest state that is not a RizzyUI component's, so a component inside a dialog or sheet syncs with the application's state. `data-syncprop-parent="#selector"` names the parent, and `.direct` keeps the closest state (RizzyUI's sidebar uses it).
- **`AsChild` children keep their handlers and ids** (decisions D-25 and D-26). The component's `x-on:*` handlers go onto the child in Alpine's `@event` form, so a handler the child declares (`<PopoverTrigger AsChild><button x-on:click="track()">`) runs alongside instead of replacing the trigger's. A binding the component computes (`x-bind:aria-expanded`) wins over the child's, with a Development warning. A child that declares an `id` keeps it, and `PopoverContent`, `DropdownMenuContent` and `TabsContent` reference it in `aria-labelledby` instead of the generated trigger id.
- **`rz:dialog-close` and `rz:sheet-close` take an optional target id** (decision D-29, Summit SF-003): `HX-Trigger: {"rz:dialog-close": {"id": "edit"}}` closes only the dialog with that id; without an id every open dialog closes, as before.
- **The Arctic theme meets WCAG AA contrast** (Summit SF-078, SF-036): darker light-mode `--primary`, `--destructive` and `--muted-foreground`, lighter dark-mode `--primary` and `--destructive` with dark text on them, and status colors that keep 4.5:1 as text on their own tint (also the theme JSON defaults). Apps that relied on the exact old values may see slightly different shades. The status theme keys are documented.
- **Accessibility defaults** (Summit SF-026, SF-031, SF-037, SF-066): `FieldError` around child content has no `role="alert"`; `RzAvatar` has no role or "Avatar" label unless `AriaLabel` is set (and takes `Decorative`); the file input's trigger is named by its visible text unless `AriaLabel` is set; `RzIndicator` is `role="img"` with an `AriaLabel` and decorative without one. Tests that found these elements by the old names need updating.
- **Built-in icons are Lucide icons** (Summit SF-023): Material Design icons rendered fixed ids (`id="mdi-..."`), duplicated on every page with two of them. `RzCheckboxGroup.CheckedIcon` defaults to `Lucide.Check`.
- **Dropped toasts are a Warning in Development** (Summit SF-006): `UseRzToast()` logs when toasts queued on a normal request or an htmx redirect cannot be delivered.
- **Requires Rizzy 6.0.0-preview.4** (Summit SF-017, SF-020, SF-043, SF-044, SF-047): absolute client script URL, htmx redirects that survive status code pages, `HtmxResponse` setters that are no-ops outside htmx requests (decision D-30), model state for list item fields, and radio inputs without an empty `id`. The starter template's `StatusPages` no longer needs its own redirect handling.

### Deprecated

- **`TableRequestModel`** (decision D-31): use `RzDataTableState`; it will be removed after 1.0.

### Fixed

- **A sheet opened from its trigger takes focus and traps Tab** (Summit SF-074). `RzSheet` activated its
  focus scope before the panel was visible, so focus stayed on the trigger behind the overlay and Tab
  walked the page. Sheets opened with `DefaultOpen` were not affected.
- **Charts survive theme changes and replacement** (Summit SF-062, SF-005). `RzChart` kept its Chart.js instance in Alpine's reactive state, so toggling dark mode threw and a replaced chart stayed registered with Chart.js. The instance now lives outside Alpine, and CSS-variable colors are resolved again on `rz:theme-change`.
- **A doughnut or pie chart lists each slice in its legend** (Summit SF-059): the chart type now reaches Chart.js.
- **Components inside a removed wrapper are destroyed.** Alpine only cleans up removed elements it initialized, so components inside a plain element that was removed (an htmx swap of a region) never ran `destroy()` and kept their listeners and third-party instances. RizzyUI now destroys those trees.
- **A calendar inside a popover works with its `RzCalendarProvider`** (Summit SF-057). The popover teleports its content to `<body>`, so the calendar's events never reached the provider around the popover: picking days changed nothing, and the docs "Range Popover" example did not work. The calendar now finds its provider through Alpine's scope, and `rz:calendar:range-complete` also reaches markup around a teleported calendar.
- **Numbers in markup are culture-independent** (Summit SF-060). Under a culture with a decimal comma (de-DE), `RzNumberTicker` wrote `data-value="96356,2"`, which its script read as 0, and `RzShineBorder` and `RzSlider` wrote their sizes, steps and `aria-value*` the same way. They are written with the invariant culture now; a test renders every component with a fractional parameter under de-DE.
- **A page's own `HeadContent` no longer removes the theme** (Summit SF-034). `RzThemeProvider` injected its CSS variables through `HeadContent`, and Blazor shows only the last `HeadContent`, so any page with its own silently fell back to the default palette. The theme now renders into `RzThemeHeadOutlet`, or at the start of the provider's output when the page has no outlet.
- **`RzCommand` renders data-driven items** (Summit SF-040). `Items` and `ItemsUrl` with a `CommandItemTemplate` showed nothing ("No data template found"): the template reported its id after the command had rendered `data-template-id`. The command now derives the id itself.
- **`RzInputTextArea` is styled like the other inputs** (Summit SF-052): it rendered without border, background, padding or focus ring.
- **Content inside a tinted alert is readable** (Summit SF-065). The Information, Success and Warning alerts colored their content with the status's `*-foreground`, made for a solid fill; on the 10% tint it was near-white on near-white. They use `text-foreground` now.
- **Starter template: links and forms are boosted** (Summit SF-021). `<body hx-boost="true">` boosts nothing in htmx 4, which inherits only `hx-boost:inherited`; every link was a full page load.
- **Starter template: error pages keep their status and leave htmx alone** (Summit SF-020). `UseStatusCodePagesWithReExecute("/not-found")` turned every empty 4xx into "Page not found" (404), swapped a whole error page into htmx partial targets and replaced htmx redirects from an expired session. The template's `UseStatusPages()` renders `/status/{code}` only for full-page requests without `HX-Redirect`.
- **Starter template: a clean build with TypeScript code-behind** (Summit SF-042). The npm and Tailwind targets ran `BeforeTargets="Build"`, after the code-behind bundling that needs `node_modules`; they run before `BeforeBuild` now.
- **A caller's `id` on `InputGroupInput` and `InputGroupTextarea` is kept** (decision D-26, Summit SF-033), so a hand-written `<label for>` reaches the input; radio items give their input an id.
- **`RzInputOTP` works under a strict `style-src`** (Summit SF-013): its hidden input used an inline style.
- **`RzSidebarProvider` renders the persisted state** (Summit SF-010): it reads its cookie on the server, so a collapsed sidebar no longer renders open and then collapses. `SidebarInset` has `min-w-0` (SF-049), so wide content scrolls inside it.
- **Dialog docs name the real close event** (Summit SF-004): `rz:dialog-close` (`Constants.Events.DialogClose`), not `rz:modal-close`.
- **Enter right after typing chooses the match** in `RzCommand` (Summit SF-025) and `RzCombobox` (SF-046: no refresh throttle for local options).
- **Tab leaves a multiple `RzCombobox`** (Summit SF-055): its option checkboxes are out of the tab order, so focus no longer falls to `<body>`.
- **Calendar weekday headers and days outside the month meet contrast** (Summit SF-077).
- **ARIA fixes** found by axe (Summit SF-035, SF-038, SF-071, SF-075, SF-076, SF-079, SF-084): `RzAuroraText` renders its label as hidden text and needs no inline style by default; `RzItem` is a list item inside `RzItemGroup`; `RzClipboard` is at least 24 px; `SidebarGroup` no longer points at a missing label; `RzPopover`'s label names its content; an empty `CommandList` is not a listbox; Markdown code blocks are focusable.
- **Sidebar action buttons meet the 24 px target size** (Summit SF-080): `SidebarMenuAction` and `SidebarGroupAction` are `w-6`.
- **No MODULE_TYPELESS_PACKAGE_JSON warning** from `@jalexsocial/rizzyui/testing` (Summit SF-072): the package's ES module folders declare `"type": "module"`.
- **`hx-*` in DataTable row templates works** (Summit SF-048): the table processes the rows Alpine renders.
- **No repeated ids in DataTable rows** (Summit SF-054): row-template helpers render an id only when given one, and the table drops generated ids copied from its `x-for` templates.
- **Docs** (Summit SF-008, SF-019, SF-027, SF-051): pages for `RzIdScope`, `RzFormSection`, `RzSearchButton`, `RzDarkModeToggle` and `RzEmbeddedPreview`; the navigation menu example renders one link per item; upload progress with htmx 4 and the state input's name are documented.
- **`RzConfetti` honors `UseWorker` in global mode** (Summit SF-083): it used canvas-confetti's default instance, which starts a `blob:` worker that a Content Security Policy blocks.
- **`InputGroupButton` keeps its size in a narrow input group** (`shrink-0`): an icon button shrank below the 24 px target size.
- **Docs examples are accessible and CSP-safe** (Summit SF-081, SF-082, SF-083): readable API tables, named icon-only buttons (`AssistiveLabel` on `RzButton`), labeled inputs, no inline handlers or scripts, no external images.

## [1.0.0-preview.3] - 2026-11-20

Still on **Rizzy 6** (`6.0.0-preview.3`) and **htmx 4**. Alpine code-behind (`RzAlpineComponent`
with a `Component.razor.js` module) is reworked: it works in the initial page, in htmx swaps and
under a strict CSP, loads modules from fingerprinted URLs, keeps props under their C# names, adds a
`ready()` hook, and comes with types, a test helper, an item template and an optional esbuild
pipeline. `RzProgress` is redesigned after shadcn/ui. Coming from 1.0.0-preview.2, see
[Changes in 1.0.0-preview.3](docs/migration/rizzy5-to-rizzy6.md#changes-in-100-preview3) in the
migration guide and [docs/engineering/alpine-code-behind.md](docs/engineering/alpine-code-behind.md).

### Breaking

- **`RzProgress` is a track with a `ProgressIndicator` inside, like shadcn/ui.** `CurrentValue`,
  `MinValue` and `MaxValue` are now `Value` (`double?`; `null` is indeterminate), `Min` and `Max`.
  `Label`, `LabelPosition` and `ProgressLabelPosition` are gone: put a visible label in markup and
  reference it with `aria-labelledby`, set `ValueText` for `aria-valuetext`, or add a
  `ProgressLabel` for text on the bar. `AriaLabel` has no English default ("Progress Bar") any
  more. The theme slots `OuterBar`, `InnerBar` and the label slots are replaced by the
  `RzProgress` (track), `ProgressIndicator` and `ProgressLabel` descriptors. `role="progressbar"`
  is on the root element.
- **`RzAlpineComponent` renders no scripts.** The module is referenced with `x-load-src` on the
  root and loaded by async-alpine; props are in a `data-rz-props` attribute instead of a
  `<script type="application/json">` referenced by `data-props-id`. `Rizzy.props(el)` reads both.
- **`Name` is optional and generated by default** (`rzcb_{Type}_{hash of the module URL}`). Set it
  only when other markup refers to the component by name.
- **A `For` component without `[RzAlpineCodeBehind]` throws** with instructions, instead of
  rendering a component whose module never loads.
- **`AsChild` with a plain markup child keeps the child's own attribute values** when they conflict
  with the component's (`id`, `x-data`, `aria-*`, ...), as the element path already did. Values used
  to be joined with a space (`id="rzX1 mine"`).
- **Props keep the names written in C#.** `Props="@(new { InitialCount = 10 })"` is read as
  `this.$props.InitialCount`; it used to be converted to camelCase (`initialCount`). Set
  `RizzyUIConfig.CodeBehindPropsSerializerOptions` to
  `new JsonSerializerOptions(JsonSerializerDefaults.Web)` to keep camelCase for the whole app.

### Added

- **`RzProgress`**: `ProgressIndicator` and `ProgressLabel` subcomponents styled per instance with
  `class`, decimal values and any range, an indeterminate state (with reduced-motion support),
  `ValueText`, and `setIndeterminate()` in the client API (`setProgress(value, valueText)`,
  `increment()`, `decrement()` remain).
- **`this.$props` / `$props`**: an Alpine magic for the component's props, in any method and in
  markup, with the standard and the CSP build.
- **`ready()` in code-behind modules**: runs after `init()` and after the components inside the
  component that load eagerly (RizzyUI's default) have started, so a module can get a child
  component (`Rizzy.$data(this.$refs.dialog)`) without waiting ticks itself. `init()` is unchanged.
- **`RizzyUIConfig.CodeBehindPropsSerializerOptions`**: the `JsonSerializerOptions` used for
  `Props` (naming policy, converters such as `JsonStringEnumConverter`).
- **Fingerprinted module URLs** with `MapStaticAssets()`: modules are cached for a year and new
  deployments get new data names, so pages left open load the new module for new markup. Also in
  htmx fragments rendered by minimal APIs. Without a manifest the plain URL is used.
- **`<link rel="modulepreload">`** for eagerly loaded modules, once per request (`Preload`).
- **Loader errors and deployments**: a failed fingerprinted URL is retried with the plain URL; a
  module that cannot load is reported once by name and dispatches `rz:module-error`; two modules
  with the same `Name` are reported.
- **Build warning `RZUI1001`** for a component marked `[RzAlpineCodeBehind]` without a module.
- **TypeScript declarations** (`types/rizzyui.d.ts`: the `Rizzy` global, `AlpineCodeBehind<TProps>`,
  `this.$props`): exported by the npm package and copied to `obj/rizzyui/` by the NuGet package.
- **Optional build pipeline** (`<RizzyUICodeBehindBuild>esbuild</RizzyUICodeBehindBuild>`):
  `Component.razor.ts` modules, npm and relative imports bundled per module, minified in Release
  (never property names), source maps in Debug.
- **`@jalexsocial/rizzyui/testing`**: `mountCodeBehind(factory, { props, html })` to test modules in
  Node with a DOM such as happy-dom.
- **`dotnet new rizzyui-codebehind`** item template (`--typescript` for a `.razor.ts` module), and a
  code-behind component in the starter template, which now uses `MapStaticAssets()` and
  `WithStaticAssets()` for fingerprinted URLs.

### Fixed

- **`RzEmbeddedPreview` (and `RzBrowser` previews) under the CSP build.** `x-data` was on the
  `<iframe>`, which the CSP build of Alpine refuses ("Evaluating expressions on an iframe is
  prohibited"), so every page with a preview logged an error. The Alpine component is now on the
  wrapper element, which also gets the component's `id`.
- **`RzProgress` no longer measures the page.** The bar was sized from script and the inside label
  positioned with a `ResizeObserver` and `clientWidth` (flicker, layout work on every resize). The
  indicator now moves with one CSS `translate` binding, and the label is centered with CSS. The
  meaningless `nonce` attribute on a `div` is gone.
- **Code-behind components in the initial page never started.** Rizzy 6 defines `window.Rizzy`
  before RizzyUI loads, so the inline registration script called a function that did not exist yet.
  This broke every code-behind example on the documentation site.
- **`[RzAlpineCodeBehind]` in a `.razor.cs` file** pointed to `Component.razor.razor.js`.

- **`RzQuickReference` lists heading text, not markup.** An `RzHeading` without `QuickReferenceTitle`
  was listed with its tags as literal text (`Sorting API (<code>sort.*</code>)`). The outline now
  shows the text a reader sees (`Sorting API (sort.*)`), with entities decoded once. `RzHeading` no
  longer overwrites its `QuickReferenceTitle` parameter with the derived title.

## [1.0.0-preview.2] - 2026-11-18

Still on **Rizzy 6** (`6.0.0-preview.3`) and **htmx 4**. This preview collects the changes planned
before 1.0: components tested in the browser under the standard and CSP runtimes, the accessibility
fixes those tests found, a smaller download, and the breaking changes that had to land before a
stable release. Coming from 1.0.0-preview.1, see
[Changes in 1.0.0-preview.2](docs/migration/rizzy5-to-rizzy6.md#changes-in-100-preview2) in the
migration guide.

### Breaking

- **`RzCombobox` sends only `value` and `text` to the browser by default.** It used to write every
  public property of each item into the page (`data-item`), including fields the page never shows.
  If your `OptionTemplate` or `ItemTemplate` reads other fields, choose them with the new
  `ItemDataSelector` parameter, for example
  `ItemDataSelector="@(u => new { u.Name, u.Email, u.Photo })"` (property names become camelCase,
  as before). (RZUI-033)
- **`RzSwitch` and `RzInputOTP` no longer set a default `aria-label`.** The default ("Toggle",
  "One-time password") replaced the name a `<label>` or `FieldLabel` gave the control, so screen
  readers announced the generic text instead of the field's name. Label them with `FieldLabel For`
  (or a `<label for>`); a control with no visible label needs `aria-label` passed explicitly.
- **The toast runtime loads on first use.** `Rizzy.toast` is still available immediately, but the
  toast manager and renderer (about 6 KB gzipped) load when a toast is first shown, or when the
  browser is idle on a page with an `RzToastProvider`. Calls made before that are queued and run in
  order; they return a handle with the toast's final id, `dismiss()` and `clear()` return
  `undefined`, and `configure()`/`registerProvider()` return `Rizzy.toast` instead of the manager.
  Await `Rizzy.toast.ready()` if you need the manager or a return value. (RZUI-056)
- **The `CanvasConfetti` asset key is removed** and `RzConfetti.ComponentAssetKeys` defaults to
  empty. canvas-confetti is bundled with the component's script; the key loaded a second copy from
  a CDN. Remove `CanvasConfetti` from any `ComponentAssetKeys` you set. (RZUI-056)
- **The packages no longer ship component sources under `dist/js/lib`** (npm) and
  `_content/RizzyUI/js/lib` (NuGet), about 0.6 MB that nothing loaded. The stylesheets that
  `rizzyui-theme.css` imports and the highlight.js Razor grammar remain. Import from the package
  entry points instead of `dist/js/lib/...`. (RZUI-056)
- **The vendored highlight.js is a smaller build.** `HighlightJsCore` now loads
  `vendor/highlightjs/highlight.min.js` (164 KB, was the 1.75 MB unminified build of every
  language), which has highlight.js's common languages plus PowerShell, Dockerfile, F#, HTTP, nginx
  and properties; Razor still comes from `HighlightJsRazor`. Every other language ships as
  `vendor/highlightjs/languages/<name>.min.js`: register it as an asset and list its key after
  `HighlightJsCore` (see `vendor/highlightjs/README.md`). The unused ESM build, unminified files and
  500 theme stylesheets are gone; the `RizzyUI` package is 2.9 MB (was 6.1 MB) with 246 files (was 1,444). (RZUI-062)

### Added

- `RzCombobox.ItemDataSelector` chooses the item data option and item templates can read (see
  Breaking).
- `Rizzy.toast.ready()` resolves when the toast runtime has loaded (see Breaking).
- `x-indeterminate="expression"` keeps a checkbox's `indeterminate` property in sync with an
  expression. It replaces `x-effect="$el.indeterminate = ..."`, a property assignment that the
  CSP build (`rizzyui-csp.js`) rejects, and works with both runtimes.
- `RzIdScope Prefix="..."` gives the components inside it deterministic ids (`{Prefix}-1`,
  `{Prefix}-2`, ... in render order), so the same markup renders the same ids: for fragments that
  are re-rendered and swapped, morph swaps and snapshot tests. (RZUI-061)
- The runtime logs a console warning when the page already has another Alpine.js instance; RizzyUI
  bundles and starts Alpine itself, and a second copy initializes components twice. (RZUI-058)

### Fixed

- Toasts appear after an htmx swap replaces the region that holds `RzToastProvider`. The runtime
  kept the removed provider and sent later toasts to its detached stacks. (RZUI-027)
- A lazy component bundle or asset that fails to load (for example during a network blip) is
  retried the next time it is needed, instead of failing from a cached error until the page
  reloads. The console error names the bundle and component. (RZUI-031)
- Components that load assets work on plain HTTP. `Rizzy.require` hashed bundle ids with
  `crypto.subtle`, which browsers only provide on HTTPS and localhost. (RZUI-026)
- `RzSlider` no longer loads `rizzyui.js` a second time as a classic script (which failed with a
  console error). Its default `ComponentAssetKeys` is now empty and the `SliderScript` asset key is
  gone. (RZUI-030)
- Apps hosted under a path base (`app.UsePathBase("/app")`) load RizzyUI's own assets and Alpine
  code-behind modules from under that base. Root-relative asset URLs get the request's `PathBase`
  when rendered; absolute URLs are unchanged. (RZUI-038)
- Alpine code-behind modules registered by `RzAlpineComponent` work when the library was built on
  Windows and runs on Linux, and component names with quotes or non-ASCII characters register
  correctly. (RZUI-054)
- `RzInputColor` works with the CSP build (`rizzyui-csp.js`). Its `x-model` bindings compiled to
  property assignments, which the Alpine CSP build rejects, so every change logged an error and the
  swatch never updated. An `x-model` passed to `RzColorSwatch` is now applied one way. (RZUI-032)
- Popover positioning, color swatches and `RzShineBorder` set their styles through the CSSOM
  instead of a `style` attribute, so they work under a Content Security Policy that does not allow
  inline styles.
- Components show English text instead of resource keys (for example an `aria-label` of
  `RzSheet.CloseButtonAriaLabel`) in apps that do not call `AddLocalization()`, including apps made
  from the `dotnet new rizzyui` template. RizzyUI uses its embedded resources when ASP.NET Core
  localization is not configured.
- Localization overrides (`LocalizationResourceType`, `LocalizationResourceLocation`) apply whether
  `AddLocalization()` is called before or after `AddRizzyUI()`. Calling it afterwards used to
  disable RizzyUI's localization. (RZUI-037)
- Calling `AddRizzyUI()` more than once registers RizzyUI's services once (each call's configure
  action still applies), and the Vercel theme is listed once in `AvailableThemes`. (RZUI-036)
- The `RzSpinner` status is announced: `role="status"` and its label are on the wrapper instead of
  an `aria-hidden` SVG. (RZUI-047)
- `RzToggle` renders its initial `aria-pressed` state on the server.
- `AsChild` with an element child no longer throws when the component passes `Id` or `Href`, and
  merges classes with TwMerge like the markup path. On both paths the child's own classes now win
  Tailwind conflicts (for example `<button class="px-6">` keeps `px-6` over a component's `px-2`);
  the markup path used to let the component's classes win. (RZUI-039)
- `RzDialog`, `RzAlertDialog` and `RzCommandDialog` render attributes you pass (for example
  `data-testid` or `aria-describedby`) on their root element; they were dropped. They cannot
  replace the component's own attributes. (RZUI-053)
- `RzCarousel` escapes `<`, `>` and `&` in its configuration script, so a `</script>` in an option
  string cannot end the script element. (RZUI-034)
- `RzMarkdown`, `RzCodeViewer` and `RzHeading` (its quick-reference title) render child content
  that comes from a Razor expression, for example `<RzMarkdown>@model.Text</RzMarkdown>`; it was
  dropped. (RZUI-050)
- `ConfigureClasses` no longer modifies the `Classes` instance you pass, so a shared instance does
  not accumulate changes across components or renders. (RZUI-055)
- Toasts queued with `IRzToastService` during a non-htmx request are logged at Debug level when
  discarded (toasts travel in htmx response headers). (RZUI-052)
- `RzNumberTicker`, `RzProgress` and `RzEmbeddedPreview` release their observers and timers when
  an htmx swap removes them. `RzEmbeddedPreview` also no longer starts a new, never-cleared interval
  on each resize attempt while its iframe is loading. (RZUI-029)
- Tooltips are announced correctly: the tooltip element was labelled by its trigger, so the
  trigger's description repeated the trigger's own text (a "Save" button was described as "Save")
  instead of the tooltip text.
- Popovers and dropdown menus keep a valid `aria-labelledby` when the trigger child has its own
  `id` (common with `AsChild`); it pointed at an element that did not exist. (RZUI-048)
- Opening a dropdown menu with Enter, Space or the arrow keys moves focus to the first (or last)
  item; focus stayed on the trigger.
- The destructive color meets WCAG AA contrast with white text (4.8:1, was 3.8:1) in the Arctic
  theme and the Vercel light theme. It is now `oklch(0.577 0.245 27.325)`.
- `RzNavigationMenu` follows the disclosure navigation pattern: moving focus onto a trigger (for
  example with Tab) no longer opens its panel, and triggers no longer announce a menu
  (`aria-haspopup` removed). Panels open with Enter, Space, click or hover. (RZUI-059)
- `RzMenubar`: ArrowLeft/ArrowRight move between top-level menus (the handler searched the wrong
  element and did nothing); opening a menu with Enter, Space or ArrowDown focuses its first item;
  Escape and choosing an item return focus to the menu's trigger.
- `RzCommand` points `aria-activedescendant` at the rendered option (`role="option"`), not at the
  item's hidden source element.
- Dialogs, alert dialogs and sheets without a title or description no longer reference missing
  elements in `aria-labelledby`/`aria-describedby`, also while closed. (RZUI-048)
- `RzTabs` values with spaces or other characters that are invalid in an HTML id (for example
  `Value="first tab"`) produce valid ids, so `aria-controls`/`aria-labelledby` work. Values made of
  letters, digits, `-` and `_` keep their current ids. (RZUI-049)
- `RzDataTable` row selection works with `rizzyui-csp.js`. `DataTableRowSelectCheckbox` and
  `DataTableSelectAllCheckbox` (and so `DataTableSelectionCell`/`DataTableSelectionHeaderCell`) set
  the indeterminate state with `$el.indeterminate = ...`, which the CSP build rejects on every
  render; they now use `x-indeterminate`. The DataTable documentation's column-visibility example
  had the same expression. Every other documented DataTable expression already worked under the CSP
  build, which is now tested in the browser.
- `AsChild` with a plain-markup child shows caller attribute values as typed: `&`, `<` and `>` are
  encoded along with quotes, so `title="Tom &amp; Jerry"` is no longer shown as "Tom & Jerry". Values
  merged from the child's markup are decoded first, so nothing is encoded twice. (RZUI-015)
- `FieldLabel For` names `RzCombobox` and `RzInputOTP`. Their inputs had ids no label could target;
  they now use the form field's id, like the other inputs. The combobox's hidden native `<select>`
  is hidden from assistive technology once the widget starts, so it no longer shows as a second,
  unnamed combobox.
- Subtle success, warning and information toasts show their title and text in the foreground color
  (the status color stays on the icon). The status-colored text measured 2.9:1 on the tinted
  background, below WCAG AA.

### Changed

- `Element` is honored on every component. 55 components (for example `RzSeparator`,
  `DialogTitle`, `SheetTrigger`, `CardContent`, `RzCheckboxGroup`) replaced it with their own tag;
  they now use it when it is set. Components no longer write their default tag into the `Element`
  parameter: derived components override `DefaultElement` instead. (RZUI-053)
- Components no longer write localized defaults into their parameters (`AriaLabel ??= ...` in 41
  components). The rendered output is unchanged; code that read, for example, `AriaLabel` from a
  component instance after rendering now sees the value that was passed (or `null`). (RZUI-053)
- A dictionary passed directly as `AdditionalAttributes` with keys that differ only by case no
  longer throws ("An item with the same key has already been added") in 29 components; the last
  key wins, as it does for markup attributes. (RZUI-053)
- **Attribute precedence is the same on every component**: `role`, `data-slot` and `type` (buttons)
  can be overridden with attributes; everything else a component computes (`class`, `id`, `x-*`,
  ARIA state, `aria-label`, configuration `data-*`, `href`) wins over attributes, so change those
  through the component's parameters. This fixes `Label`, `RzAspectRatio`, `RzCombobox` and
  `RzCalendarProvider`, where a `class` attribute replaced the component's classes instead of being
  merged, and `RzDropdownMenu` and `RzCalendarProvider`, where attributes could replace `x-data`.
  `RzAvatar`, `RzAlert` and `RzToastProvider` no longer take `aria-label`/`aria-live` from attributes
  (use `AriaLabel`, `RzAlert.LiveRegionMode` and `RegionAriaLabel`). `RzSidebar` renders caller attributes when it is
  collapsible (they were dropped). Wrapping components now set the `data-slot` they declare on the
  component they render (for example the `RzInputColor` swatch is `thumbnail`). (RZUI-053)
- Ids that components derive (dialog and sheet titles and descriptions, dialog body and footer,
  accordion sections, checkbox and radio group legends, command group headings, sidebar group labels,
  the code viewer's code element, calendar and date edit elements, Markdown heading anchors) are now
  `{Id}-<part>` instead of separately generated, and a component given an `Id` no longer generates
  one it does not use. (RZUI-061)
- Every component's root has a `data-slot`; 16 did not (`RzSwitch`, `RzLink`, `RzCarousel` and its
  parts, `RzDateEdit`, `RzSteps`, `RzSearchButton`, `RzDarkModeToggle`, `RzFormSection` and others).
  (RZUI-053)
- The README, Getting Started, the theme guide, the migration guide and the `dotnet new rizzyui`
  template load the minified runtime (`rizzyui.min.js`, `rizzyui-csp.min.js`), about half the bytes
  of `rizzyui.js`. The unminified files remain for debugging. (RZUI-056)
- The eager runtime is 33.0 KB gzipped (standard) and 36.7 KB (CSP), down from 37.0 and 40.6 KB.
- The DataTable documentation states the component's contract (headless and composable; the
  application decides what `Items` exposes), adds grouped columns with custom cells, DTO projection,
  events, htmx swaps and a tested Strict CSP section, and documents the runtime projections and
  `x-flexrender`. The engineering contract is in `docs/engineering/rzdatatable-architecture.md`.

### Removed

- `RizzyUI` no longer depends on `Scrutor`, and it no longer decorates the application's
  `IStringLocalizerFactory`; it registers its own `IStringLocalizer<RizzyLocalization>`.
- `@jalexsocial/rizzyui` no longer depends on `shadcn-prose` (deprecated) or `tailwindcss-inset`.
  Neither was imported by the package's CSS or JavaScript. If your own stylesheet imports one of
  them, add it to your `package.json`.

### Security

- Removed unused build tooling (`repomix`, `webpack`, `babel`, `eslint` 8 and others) and updated
  `vite`, `esbuild` and `postcss`, which clears the npm audit findings, including every critical one,
  in the repository's lockfiles. None of these packages ship to users. The one remaining finding,
  a ReDoS in `picomatch` (GHSA-fc5q-39xc-vjpf), has no patched release; the build passes it only
  patterns from its own configuration.
- The test project uses bUnit 2.15.2, which brings AngleSharp 1.10.1 (fixes GHSA-pgww-w46g-26qg).

## [1.0.0-preview.1] - 2026-11-17

RizzyUI now targets **Rizzy 6** (`6.0.0-preview.3`) and **htmx 4**. See the
[migration guide](docs/migration/rizzy5-to-rizzy6.md).

### Breaking

- **Rizzy 6 and htmx 4 are required.** The `RizzyUI` package depends on `Rizzy` 6.0.0-preview.3,
  which targets htmx 4.0.1 or later. Follow Rizzy's
  [htmx 2 to htmx 4 guide](https://github.com/JalexSocial/Rizzy/blob/main/docs/migration/htmx2-to-htmx4.md)
  for your own markup, then RizzyUI's [migration guide](docs/migration/rizzy5-to-rizzy6.md).
- **htmx is no longer an npm dependency of `@jalexsocial/rizzyui`.** It is an optional peer
  dependency (`htmx.org` `^4.0.1`). The RizzyUI bundle never imported htmx; load it with Rizzy's
  `<RzScripts />` or install `htmx.org` yourself. (RZUI-003)
- **`antiforgerySnippet.js` is deprecated and does nothing.** It relied on htmx 2 events that htmx 4
  does not raise. Rizzy 6 attaches the antiforgery token itself; remove the script tag. The file and
  its package export remain for now and log a warning. (RZUI-007)
- **`RzButton` no longer renders a default `aria-label`.** Buttons were labelled "Action Button" for
  assistive technology whatever their visible text, and an `aria-label` passed as an attribute was
  overwritten. The visible text now names the button. Set `AssistiveLabel` (or `aria-label`) on
  icon-only buttons. (RZUI-013)
- **Dialog triggers use `x-on:click` instead of an inline `onclick`.** `DialogTrigger` and
  `AlertDialogTrigger` still raise the dialog's `EventTriggerName` window event, so code listening
  for it keeps working, but markup tests that looked for the `onclick` attribute must be updated.
  (RZUI-012)

- **`RzMarkdown` no longer renders raw HTML or Markdig generic attributes by default.** HTML in the
  Markdown is escaped and shown as text, and `{onclick=...}` attribute blocks are not parsed, so
  user-supplied Markdown cannot inject scripts or live Alpine/htmx attributes. Set the new
  `AllowUnsafeHtml="true"` parameter for trusted content that needs HTML. A custom `Pipeline` is
  used as-is. In every mode, Markdown links, images and autolinks with a `javascript:`,
  `vbscript:` or `data:` URL (except raster images) are reduced to their text. The default
  pipelines are now built once and shared. (RZUI-017)

### Added

- **`dotnet new rizzyui`.** The new `RizzyUI.Templates` NuGet package (released with RizzyUI, same
  version) creates an ASP.NET Core app with a collapsible sidebar layout, light and dark mode, a
  dashboard, a searchable and paged table, a validated form posted with htmx, 404 and error
  pages, `RzController` pages and minimal API fragment endpoints, and Tailwind CSS v4 built with
  npm. Options: `--framework net10.0|net11.0`, `--theme Arctic|Vercel`. The template pins the
  `RizzyUI` and `@jalexsocial/rizzyui` versions it was released with. CI and the release workflow
  generate, build, publish and run the app (`eng/template-test.sh`).

### Fixed

- Form inputs render the value of the field named by `For` when `Value` is not passed. Before,
  `<RzInputText For="@(() => Model.Email)" />` rendered an empty control unless `Value` was also
  set, so a form re-rendered after a failed post (422) lost what the user entered. This applies to
  every input built on `InputBase` (`RzInputText`, `RzInputTextArea`, `RzInputNumber`,
  `RzInputCheckbox`, `RzSwitch`, `RzNativeSelect`, `RzInputColor`, `RzCombobox`, `SidebarInput`).
  A `Value` you pass, including `null`, still wins. `RzCombobox` keeps using
  `SelectListItem.Selected` when the field is null, an empty string or an empty collection.
- `@jalexsocial/rizzyui` lists `tw-animate-css` as a dependency. `rizzyui-theme.css` imports it,
  so compiling `rizzyui-plugin.css` with Tailwind in an app failed with an unresolved import unless
  the app installed it itself. The package check now fails when the package's CSS imports a
  package it does not depend on.
- `FieldLabel` with `For` points at its input whether it comes before or after it. RizzyUI inputs
  rendered their own id on the control while Rizzy registered a different, generated one for the
  field, so the label's `for` never matched, and a label before its input found no id at all. Text,
  number, text area, native select, switch, checkbox, sidebar and input-group inputs and
  `RzDateEdit` now use the id registered or reserved for the field (an explicit `Id` is kept and
  registered). Requires Rizzy 6.0.0-preview.3 (`GetOrReserveFieldId`). A label for a field no
  RizzyUI input renders (a checkbox or radio group) should use `ForId` or omit `For`.
- The carousel wheel-gestures plugin loads. Its default URL pointed at
  `embla-carousel-wheel-gestures@8.1.7`, a version that does not exist (that package has its own
  version line); it now uses 8.1.0 from `dist/`. Canvas confetti loads the published
  `dist/confetti.browser.js` rather than a file jsDelivr minifies on request. (RZUI-018)
- Dialogs, alert dialogs and sheets close on Escape, trap focus with their focus scope and return
  focus to the trigger. The panels are teleported to `<body>`, and the runtime looked for them
  inside the component, so this behavior never activated. (RZUI-010, RZUI-011)
- htmx attributes inside dialog, sheet, popover and dropdown content now work. That content is
  teleported to `<body>` after htmx has processed the page, so a form with `hx-post` in a dialog
  submitted as a normal page post. (RZUI-009)
- `window.Rizzy` is shared with Rizzy's client instead of being replaced by a copy, and
  `window.Rizzy.validation` is no longer always `undefined`. (RZUI-008)
- Components no longer render raw resource keys (for example
  `aria-label="RzSheet.CloseButtonAriaLabel"`). Missing English strings were added, and partial
  translations (de, es, fr, pt) fall back to English. (RZUI-014)
- Attribute values passed to `AsChild` components with plain markup children are escaped, so a quote
  cannot end the attribute. (RZUI-015)
- The Markdown code-fence language is HTML-encoded in the generated `class` attribute. (RZUI-016)
- Sheets and dropdown menus release their dismissable layer and focus listeners when removed (for
  example by an htmx swap) while open. (RZUI-028)
- The npm package's `main`, `module` and `exports` point at files that exist;
  `@jalexsocial/rizzyui/dist/*` (CSS) can be imported. (RZUI-002)
- The npm package no longer declares a `file:` dependency on the documentation project, which left
  a dangling link in consumers' `node_modules`. (RZUI-001)
- Neither package ships unit tests, and the NuGet package no longer adds RizzyUI's own
  `package.json`, `package-lock.json` and tool configuration files to consuming projects.
  (RZUI-021, RZUI-022)
- `RzDateEdit` passes its `Options` to Flatpickr. They were silently dropped, so format, locale and
  min/max dates had no effect. The picker is destroyed when the field is removed (for example by an
  htmx swap), so calendars and their document listeners no longer pile up, and missing or invalid
  data attributes no longer throw. (RZUI-025)
- `RzDateEdit` renders its value in the configured `DateFormat` (it rendered `Y-0-20` for
  `Y-m-d`), sends dates to the browser so a custom `DateFormat` cannot misread them, includes the
  time in the default date, and no longer writes `DefaultDate` into a shared `Options` instance.
- `RzDateEdit` values are submitted with their form. The input had no `name` attribute; it now has
  the name Blazor's own inputs use (for example `Model.StartDate`), is registered for labels and
  validation messages, and gets validation attributes such as `[Required]`.
- Packing `RizzyUI.Tasks` from a clean checkout produced a package without the task assembly
  (`tasks/<tfm>/` was collected before the build ran). The files are now collected after the build.
- `RizzyUI.Tasks` targets `netstandard2.0` again, as the published 1.3.5 does, so the task also loads
  in .NET Framework MSBuild (Visual Studio). The source had moved to `net10.0` without a version
  bump; the package checker now requires `tasks/netstandard2.0/`.

### Changed

- Default CDN assets are pinned to exact versions and load with Subresource Integrity
  (`integrity` plus `crossorigin="anonymous"`). The previously unpinned defaults are pinned at the
  versions they resolved to: flatpickr 4.6.13, Chart.js 4.6.1, Coloris 0.25.1, rough-notation
  0.5.1 and vanilla-calendar-pro 3.4.0. New `RizzyUIConfig.AssetIntegrity` maps a URL to its hash;
  an overridden `AssetUrls` entry does not inherit the default hash. The client loader accepts
  `{ src, integrity }` entries as well as URL strings. (RZUI-018)
- Documentation app and examples use `<RzHeadOutlet />` and `<RzScripts />` (Rizzy 6) and htmx 4
  syntax (`show:top showTarget:window`). (RZUI-005, RZUI-006)
- CI runs on every pull request and never publishes. Releases are published by a separate,
  tag-triggered workflow that requires approval. The documentation site deploys from its own
  workflow. (RZUI-019)
- Removed the `InstallClientPackages` and `BuildClientAssets` MSBuild targets from
  `RizzyUI.csproj`. They never ran (they hooked a target that only multi-targeted projects have).
  The client bundles stay committed, and CI checks them against a fresh build. (RZUI-020)
- The project version is `1.0.0-preview.1-dev` in both `RizzyUI.csproj` and the npm manifest
  (previously `0.9.2-alpha` and `0.9.2`). (RZUI-042)
- `RizzyUI.Tasks` is released by the same tag as `RizzyUI`, pushed first and only when its version
  is not on nuget.org yet. Its version is set once, in `src/Directory.Build.props`. CI and the docs
  workflow pack it and restore from the local package, and the package checker verifies it.
  (RZUI-042)
