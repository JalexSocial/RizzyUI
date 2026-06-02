# RizzyUI RzToastProvider Implementation Specification

This file is the authoritative source of truth for the RzToastProvider component. Each prompt must begin by reading this file and `AGENTS.md`. If this specification conflicts with `AGENTS.md`, follow `AGENTS.md` and then adapt the implementation while preserving the intent of this specification.

## 1. Objective

Replace the current `simple-notify`-based toast integration in RizzyUI with a native RizzyUI toast system that:

- Provides a root-layout SSR component named `RzToastProvider`.
- Preserves the existing public `Rizzy.toast` API.
- Adds a richer internal runtime supporting update, dismiss, loading, dedupe, actions, multi-position stacks, and accessibility behavior.
- Uses the current RizzyUI style-provider pattern to generate all Tailwind classes server-side.
- Keeps JavaScript responsible for runtime behavior only.
- Removes the `simple-notify` dependency.
- Adds tests and documentation.

This is not a Blazor interactive component. It must work in SSR mode and must not depend on a Blazor circuit.

## 2. Required Repository Alignment

Codex must inspect the current repository before editing. The repository has changed over time, so do not rely on old assumptions.

Required inspection targets:

- `AGENTS.md`
- Existing feedback components such as `RzAlert`
- Existing externally styled components such as `RzCombobox`
- `src/RizzyUI/RzTheme.cs`
- `src/RizzyUI/RzTheme.StyleProviders.cs`
- `packages/rizzyui/src/js/lib/notify/toast.js`
- JavaScript bootstrap files under `packages/rizzyui/src/js`
- Existing component tests under `src/RizzyUI.Tests/Components`
- Existing docs pages under `src/RizzyUI.Docs/Components/Pages/Components`
- `src/RizzyUI.Docs/Components/Layout/ComponentList.razor`

Implementation rules:

- Do not use Blazor event APIs such as `@onclick`, `@bind`, or `EventCallback`.
- Do not add client behavior that requires Blazor Server, SignalR, WebAssembly, or interactive render mode.
- Do not edit generated output in `packages/rizzyui/dist` or `src/RizzyUI/wwwroot`.
- Do not preserve Simple Notify CSS class names. Preserve API compatibility only.
- All new public C# types, members, parameters, methods, and enums must have useful XML documentation.
- Use semantic Tailwind tokens, not raw palette colors.
- New component docs and navigation are mandatory.

## 3. Component Naming

The only Razor component is:

```text
RzToastProvider
```

Do not create:

```text
RzToast
RzToastItem
ToastItem
```

The provider is a viewport/stack provider only. Individual toast items are JavaScript-rendered DOM nodes using server-generated class maps.

Recommended C# file locations:

```text
src/RizzyUI/Components/Feedback/RzToast/RzToastProvider.razor
src/RizzyUI/Components/Feedback/RzToast/RzToastProvider.razor.cs
src/RizzyUI/Components/Feedback/RzToast/RzToastEnums.cs
src/RizzyUI/Components/Feedback/RzToast/RzToastProviderOptions.cs
src/RizzyUI/Components/Feedback/RzToast/RzToastClassMapBuilder.cs
src/RizzyUI/Components/Feedback/RzToast/Styling/RzToastProviderStyles.cs
```

If the current repository has a more specific folder convention, use it while preserving public names and responsibilities.

## 4. Style-Provider Pattern

Use the current external style-provider pattern, not a standalone nested `Slots` class unless current repository inspection proves otherwise.

Create:

```csharp
public interface IHasRzToastProviderStylingProperties
public sealed partial class RzToastProviderSlots : ISlots
public static class RzToastProviderStyles
```

`RzToastProvider` should derive from the normal component base:

```csharp
public partial class RzToastProvider : RzComponent<RzToastProviderSlots>, IHasRzToastProviderStylingProperties
```

or the nearest equivalent current pattern.

It should return:

```csharp
protected override TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> GetDescriptor()
    => Theme.RzToastProvider;
```

## 5. Theme Integration

Add a theme descriptor named `RzToastProvider`.

In `src/RizzyUI/RzTheme.StyleProviders.cs`:

```csharp
/// <summary>
/// Gets or sets the style definitions for the <see cref="RizzyUI.RzToastProvider"/> component and JavaScript-rendered toast items.
/// </summary>
public virtual TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> RzToastProvider { get; set; }
```

In `src/RizzyUI/RzTheme.cs`, add a constructor assignment near feedback components:

```csharp
RzToastProvider = RizzyUI.RzToastProviderStyles.DefaultDescriptor;
```

## 6. Public JavaScript API

Preserve the existing public API exactly:

```js
Rizzy.toast.custom(options)
Rizzy.toast.success(text, title = 'Success', options = {})
Rizzy.toast.error(text, title = 'Error', options = {})
Rizzy.toast.warning(text, title = 'Warning', options = {})
Rizzy.toast.info(text, title = 'Info', options = {})
Rizzy.toast.setDefaults(newDefaults = {})
Rizzy.toast.allowedStatuses
Rizzy.toast.allowedPositions
```

Add:

```js
Rizzy.toast.show(options)
Rizzy.toast.loading(text, title = 'Loading', options = {})
Rizzy.toast.update(id, options)
Rizzy.toast.dismiss(id)
Rizzy.toast.clear()
```

`custom(options)` must call `show(options)`.

Do not implement `Rizzy.toast.promise()` in v1.

Do not implement `onShown`, `onUpdate`, or `onDismiss` per-toast option callbacks in v1. Consumers should use lifecycle events.

Action callbacks are allowed through `action.onClick`.

## 7. Enums

Create public enums in namespace `RizzyUI`.

```csharp
public enum ToastStatus
{
    Default,
    Info,
    Success,
    Warning,
    Error,
    Loading
}

public enum ToastPosition
{
    TopLeft,
    TopCenter,
    TopRight,
    BottomLeft,
    BottomCenter,
    BottomRight,
    Center,
    LeftCenter,
    RightCenter
}

public enum ToastTone
{
    Subtle,
    Solid,
    Outline,
    Ghost
}

public enum ToastAnimation
{
    Fade,
    Slide,
    None
}

public enum ToastState
{
    Entering,
    Visible,
    Leaving
}

public enum ToastOverflowStrategy
{
    DismissOldest,
    IgnoreNewest
}
```

Canonical status strings:

```text
default
info
success
warning
error
loading
```

Canonical position strings:

```text
top-left
top-center
top-right
bottom-left
bottom-center
bottom-right
center
left-center
right-center
```

## 8. Provider Parameters

`RzToastProvider` must expose:

```csharp
[Parameter] public ToastPosition Position { get; set; } = ToastPosition.TopRight;
[Parameter] public ToastStatus DefaultStatus { get; set; } = ToastStatus.Info;
[Parameter] public ToastTone Tone { get; set; } = ToastTone.Subtle;
[Parameter] public ToastAnimation Animation { get; set; } = ToastAnimation.Fade;
[Parameter] public ToastOverflowStrategy OverflowStrategy { get; set; } = ToastOverflowStrategy.DismissOldest;

[Parameter] public int Duration { get; set; } = 4000;
[Parameter] public int Speed { get; set; } = 300;
[Parameter] public int MaxVisible { get; set; } = 5;

[Parameter] public bool NewestOnTop { get; set; } = true;
[Parameter] public bool Dismissible { get; set; } = true;
[Parameter] public bool ShowIcon { get; set; } = true;
[Parameter] public bool ShowProgress { get; set; } = true;
[Parameter] public bool PauseOnHover { get; set; } = true;
[Parameter] public bool PauseOnFocus { get; set; } = true;
[Parameter] public bool PauseOnWindowBlur { get; set; } = false;
[Parameter] public bool CloseOnEscape { get; set; } = true;
[Parameter] public bool PreventDuplicates { get; set; } = false;

[Parameter] public string? CloseButtonAriaLabel { get; set; }
[Parameter] public string? RegionAriaLabel { get; set; }
```

Do not add `ChildContent`.

Do not add `EventCallback`.

## 9. Styling Slots

Use `RzToastProviderSlots`.

Every slot must have a `[Slot("...")]` attribute and XML documentation.

```csharp
public sealed partial class RzToastProviderSlots : ISlots
{
    [Slot("toast-provider")]
    public string? Base { get; set; }

    [Slot("toast-viewport")]
    public string? Viewport { get; set; }

    [Slot("toast-stack")]
    public string? Stack { get; set; }

    [Slot("toast")]
    public string? Toast { get; set; }

    [Slot("toast-inner-container")]
    public string? InnerContainer { get; set; }

    [Slot("toast-icon-container")]
    public string? IconContainer { get; set; }

    [Slot("toast-icon-pulse")]
    public string? IconPulse { get; set; }

    [Slot("toast-loading-indicator")]
    public string? LoadingIndicator { get; set; }

    [Slot("toast-content-container")]
    public string? ContentContainer { get; set; }

    [Slot("toast-title")]
    public string? Title { get; set; }

    [Slot("toast-description")]
    public string? Description { get; set; }

    [Slot("toast-action-container")]
    public string? ActionContainer { get; set; }

    [Slot("toast-action-button")]
    public string? ActionButton { get; set; }

    [Slot("toast-close-button")]
    public string? CloseButton { get; set; }

    [Slot("toast-close-button-icon")]
    public string? CloseButtonIcon { get; set; }

    [Slot("toast-progress-track")]
    public string? ProgressTrack { get; set; }

    [Slot("toast-progress-indicator")]
    public string? ProgressIndicator { get; set; }

    [Slot("toast-sr-only")]
    public string? SrOnly { get; set; }
}
```

Use `Base` for the root slot because RizzyUI conventions commonly use `Base` for root slot classes. Its rendered `data-slot` value is `toast-provider`.

## 10. Styling Descriptor

`RzToastProviderStyles.DefaultDescriptor` must contain all Tailwind classes used by the provider and JavaScript-rendered items.

JavaScript must not construct Tailwind classes.

Base slot classes:

```text
Base: pointer-events-none fixed inset-0 z-50
Viewport: pointer-events-none fixed inset-0 flex max-h-screen w-full p-4 sm:p-6
Stack: flex w-full max-w-sm flex-col gap-3
Toast: not-prose pointer-events-auto relative w-full overflow-hidden rounded-lg border text-sm shadow-lg transition-all duration-200 ease-out motion-reduce:transition-none
InnerContainer: flex w-full items-start gap-x-3 px-4 py-3
IconContainer: relative flex size-6 shrink-0 items-center justify-center text-2xl translate-y-0.5
IconPulse: absolute size-6 aspect-square rounded-full animate-ping motion-reduce:animate-none
LoadingIndicator: size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none
ContentContainer: flex min-w-0 flex-1 flex-col gap-y-0.5 translate-y-0.5
Title: font-medium tracking-tight line-clamp-1
Description: text-sm text-foreground/90 [&_p]:leading-relaxed
ActionContainer: mt-3 flex items-center gap-2
ActionButton: inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
CloseButton: ml-auto self-start rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
CloseButtonIcon: size-4 shrink-0
ProgressTrack: absolute bottom-0 left-0 h-1 w-full bg-transparent
ProgressIndicator: h-full w-full origin-left transition-transform ease-linear motion-reduce:transition-none
SrOnly: sr-only
```

Status variants:

- `Default`: neutral background, border, foreground.
- `Info`: `border-info bg-info/10 text-info-foreground`, icon `text-info`, pulse `bg-info/15`, progress `bg-info`.
- `Success`: `border-success bg-success/10 text-success-foreground`, icon `text-success`, pulse `bg-success/15`, progress `bg-success`.
- `Warning`: `border-warning bg-warning/10 text-warning-foreground`, icon `text-warning`, pulse `bg-warning/15`, progress `bg-warning`.
- `Error`: `border-destructive bg-destructive/10 text-destructive`, icon `text-destructive`, pulse `bg-destructive/15`, progress `bg-destructive`.
- `Loading`: info-toned neutral card, loading indicator `text-info`.

Position variants:

- `TopLeft`: viewport `items-start justify-start`, stack `items-start`.
- `TopCenter`: viewport `items-start justify-center`, stack `items-center`.
- `TopRight`: viewport `items-start justify-end`, stack `items-end`.
- `BottomLeft`: viewport `items-end justify-start`, stack `items-start`.
- `BottomCenter`: viewport `items-end justify-center`, stack `items-center`.
- `BottomRight`: viewport `items-end justify-end`, stack `items-end`.
- `Center`: viewport `items-center justify-center`, stack `items-center`.
- `LeftCenter`: viewport `items-center justify-start`, stack `items-start`.
- `RightCenter`: viewport `items-center justify-end`, stack `items-end`.

Tone variants:

- `Subtle`: default status treatment.
- `Outline`: `bg-background`.
- `Ghost`: `border-transparent bg-background/95 shadow-md`.
- `Solid`: implement if compound variants are practical; otherwise server-side class map can apply status+tone overrides. Do not implement solid logic in JavaScript.

Animation variants:

- `Fade`: `transition-opacity transition-transform`.
- `Slide`: `transition-opacity transition-transform`.
- `None`: `transition-none`.

State variants:

- `Entering`: `opacity-0 translate-y-2 scale-95`.
- `Visible`: `opacity-100 translate-y-0 scale-100`.
- `Leaving`: `opacity-0 translate-y-2 scale-95`.

Use semantic tokens only.

## 11. Provider Markup

`RzToastProvider` must render all stacks up front so simultaneous toasts in different positions do not fight over one stack.

It must render one viewport and one stack for each canonical position:

```text
top-left
top-center
top-right
bottom-left
bottom-center
bottom-right
center
left-center
right-center
```

Conceptual markup:

```razor
<HtmlElement Element="@EffectiveElement"
             id="@Id"
             role="region"
             aria-label="@ResolvedRegionAriaLabel"
             @attributes="@AdditionalAttributes"
             class="@SlotClasses.GetBase()"
             data-rz-toast-provider
             data-slot="@RzToastProviderSlotNames.NameOf(RzToastProviderSlotTypes.Base)">
    @foreach (var position in SupportedPositions)
    {
        <div data-rz-toast-viewport
             data-toast-position="@ToCanonicalPosition(position)"
             class="@GetViewportClass(position)"
             data-slot="@RzToastProviderSlotNames.NameOf(RzToastProviderSlotTypes.Viewport)">
            <div data-rz-toast-stack
                 data-toast-position="@ToCanonicalPosition(position)"
                 class="@GetStackClass(position)"
                 data-slot="@RzToastProviderSlotNames.NameOf(RzToastProviderSlotTypes.Stack)">
            </div>
        </div>
    }

    <script type="application/json" data-rz-toast-config>
        @SerializedToastConfig
    </script>
</HtmlElement>
```

If repository CSP rules forbid JSON script tags, use `<template data-rz-toast-config>`.

## 12. Class Map Builder

Create a server-side builder that generates a serializable class map from `Theme.RzToastProvider`.

Class map builder responsibilities:

- Resolve base slot classes.
- Resolve every status.
- Resolve every position.
- Resolve every tone.
- Resolve every animation.
- Resolve every state.
- Include defaults.
- Include icons.
- Include alias maps.
- Cache class maps per theme/configuration.

Do not parse `TvDescriptor` manually if the repository provides a class resolution API. Use the same resolution path as components.

If needed, create an internal style state object:

```csharp
private sealed class RzToastProviderStyleState : RzComponent<RzToastProviderSlots>, IHasRzToastProviderStylingProperties
{
    public ToastStatus Status { get; init; }
    public ToastPosition Position { get; init; }
    public ToastTone Tone { get; init; }
    public ToastAnimation Animation { get; init; }
    public ToastState State { get; init; }
}
```

Adapt to actual base class requirements.

### 12.1 Caching

Use an existing cache pattern if present; otherwise:

```csharp
private static readonly ConcurrentDictionary<RzToastClassMapCacheKey, RzToastClassMap> Cache = new();
```

The cache key must include:

- Theme code or theme identity.
- Descriptor identity/hash.
- Default status.
- Default position.
- Tone.
- Animation.
- Overflow strategy.
- Duration.
- Speed.
- Max visible.
- Newest on top.
- Dismissible.
- Show icon.
- Show progress.
- Pause on hover.
- Pause on focus.
- Pause on window blur.
- Close on escape.
- Prevent duplicates.

Cache class maps separately from localized labels. Compose labels at render time.

### 12.2 JSON Schema

Emit JSON shaped like:

```json
{
  "version": 1,
  "providerId": "rz-toast-provider-...",
  "defaults": {
    "status": "info",
    "position": "top-right",
    "tone": "subtle",
    "animation": "fade",
    "duration": 4000,
    "speed": 300,
    "dismissible": true,
    "showIcon": true,
    "pauseOnHover": true,
    "pauseOnFocus": true,
    "pauseOnWindowBlur": false,
    "closeOnEscape": true,
    "preventDuplicates": false,
    "progress": true,
    "maxVisible": 5,
    "newestOnTop": true,
    "overflowStrategy": "dismiss-oldest",
    "closeButtonAriaLabel": "Dismiss notification",
    "regionAriaLabel": "Notifications"
  },
  "slots": {
    "base": "",
    "viewport": "",
    "stack": "",
    "toast": "",
    "innerContainer": "",
    "iconContainer": "",
    "iconPulse": "",
    "loadingIndicator": "",
    "contentContainer": "",
    "title": "",
    "description": "",
    "actionContainer": "",
    "actionButton": "",
    "closeButton": "",
    "closeButtonIcon": "",
    "progressTrack": "",
    "progressIndicator": "",
    "srOnly": ""
  },
  "statuses": {},
  "positions": {},
  "tones": {},
  "animations": {},
  "states": {},
  "icons": {},
  "aliases": {}
}
```

Use `"base"` in JSON for the root provider slot even though rendered data-slot is `toast-provider`.

## 13. Position Aliases

Support all Simple Notify aliases.

```text
right top       -> top-right
top right       -> top-right
left top        -> top-left
top left        -> top-left
right bottom    -> bottom-right
bottom right    -> bottom-right
left bottom     -> bottom-left
bottom left     -> bottom-left
top center      -> top-center
center top      -> top-center
x-center top    -> top-center
top x-center    -> top-center
bottom center   -> bottom-center
center bottom   -> bottom-center
x-center bottom -> bottom-center
bottom x-center -> bottom-center
center          -> center
left center     -> left-center
left y-center   -> left-center
y-center left   -> left-center
right center    -> right-center
right y-center  -> right-center
y-center right  -> right-center
```

Support status alias:

```text
destructive -> error
```

Support type aliases:

```text
filled -> solid
outline -> outline
```

Support effect aliases:

```text
fade -> fade
slide -> slide
```

## 14. JavaScript Runtime

Files:

```text
packages/rizzyui/src/js/lib/notify/rzToastNormalize.js
packages/rizzyui/src/js/lib/notify/rzToastIcons.js
packages/rizzyui/src/js/lib/notify/rzToastRenderer.js
packages/rizzyui/src/js/lib/notify/rzToastManager.js
packages/rizzyui/src/js/lib/notify/toast.js
```

### 14.1 Normalize

Input options:

```js
{
  id,
  status,
  variant,
  type,
  tone,
  effect,
  animation,
  title,
  text,
  message,
  description,
  html,
  showIcon,
  icon,
  customIcon,
  showCloseButton,
  dismissible,
  customClass,
  className,
  classNames,
  speed,
  autoclose,
  autotimeout,
  duration,
  position,
  action,
  pauseOnHover,
  pauseOnFocus,
  pauseOnWindowBlur,
  progress,
  role,
  ariaLive,
  dedupeKey,
  incrementCount,
  data
}
```

Normalization rules:

```text
variant -> status if status absent
description -> text if text/message absent
message -> text if text absent
autotimeout -> duration
effect -> animation
showCloseButton -> dismissible
customClass/className -> root custom class
classNames -> per-slot custom class map
type "filled" -> tone "solid"
type "outline" -> tone "outline"
destructive -> error
```

Default normalized values come from provider config.

`loading()` defaults:

```js
{
  status: 'loading',
  autoclose: false,
  progress: false
}
```

### 14.2 Renderer

Create DOM with DOM APIs, not string concatenation.

Required item shape:

```html
<div data-rz-toast-item data-toast-id="..." data-toast-status="success" data-slot="toast" role="status" aria-live="polite" aria-atomic="true">
  <div data-slot="toast-inner-container">
    <div data-slot="toast-icon-container" aria-hidden="true"></div>
    <div data-slot="toast-content-container">
      <div data-slot="toast-title"></div>
      <div data-slot="toast-description"></div>
      <div data-slot="toast-action-container">
        <button data-slot="toast-action-button" type="button"></button>
      </div>
    </div>
    <button data-slot="toast-close-button" type="button" aria-label="Dismiss notification">
      <svg data-slot="toast-close-button-icon"></svg>
    </button>
  </div>
  <div data-slot="toast-progress-track">
    <div data-slot="toast-progress-indicator"></div>
  </div>
</div>
```

Use `textContent` for title and text. Do not use `innerHTML` for ordinary toast text. Do not support untrusted string HTML in v1.

### 14.3 Icons

Create SVG icons safely using DOM APIs. Do not require Simple Notify SVG assets. Create icons for:

- info
- success
- warning
- error
- loading
- close

Support `icon: false`, `icon: HTMLElement`, and `customIcon: HTMLElement`. If string icon support is retained for compatibility, treat it as trusted and document the risk; prefer not supporting string SVG in v1.

### 14.4 Manager

The manager must:

- Register the provider by querying `[data-rz-toast-provider]`.
- Parse `[data-rz-toast-config]`.
- Register all stacks by `[data-rz-toast-stack][data-toast-position]`.
- Insert each toast into the stack matching normalized position.
- Manage active toasts by ID.
- Support duplicate ID update.
- Support `dedupeKey`.
- Support provider-level `PreventDuplicates`.
- Enforce `MaxVisible` per position stack.
- Support `ToastOverflowStrategy.DismissOldest`.
- Support `ToastOverflowStrategy.IgnoreNewest`.
- Support timers using `setTimeout`.
- Pause/resume timers on hover/focus/window blur as configured.
- Apply entering, visible, and leaving state classes.
- Dispatch lifecycle events.
- Return handles from `show()`.

Handle shape:

```js
{
  id,
  update(options) {},
  dismiss() {}
}
```

Dismiss semantics:

```text
dismiss(id) -> dismiss specific toast
dismiss()   -> dismiss most recent toast
clear()     -> dismiss all toasts
```

Dismiss reasons:

```text
timeout
close-button
api
escape
clear
viewport-limit
ignore-newest
```

## 15. Accessibility

Status/live mapping:

```text
default -> role="status", aria-live="polite"
info    -> role="status", aria-live="polite"
success -> role="status", aria-live="polite"
warning -> role="status", aria-live="polite"
error   -> role="alert",  aria-live="assertive"
loading -> role="status", aria-live="polite"
```

Always set `aria-atomic="true"`.

Rules:

- Toasts must not steal focus.
- Action button and close button must be keyboard reachable.
- Close button must be `<button type="button">`.
- Escape dismisses only a toast containing focus and only if `CloseOnEscape` is true.
- If a focused toast is removed, avoid leaving focus on a removed element.
- Timers pause on hover/focus/window blur according to options.
- Motion reduction classes must be included where appropriate.
- Functional behavior must not depend on animation.

## 16. Events

Input events:

```text
rz:toast
rz:toast:show
rz:toast:update
rz:toast:dismiss
rz:toast:clear
```

Lifecycle events:

```text
rz:toast:shown
rz:toast:updated
rz:toast:dismissed
rz:toast:cleared
```

Details should be serializable. Lifecycle detail:

```js
{
  id,
  status,
  reason,
  data
}
```

No DOM nodes in event detail.

The runtime should listen on `window` and, if needed for HTMX-trigger compatibility, also on `document`.

## 17. Action Button

Support one action button.

Example:

```js
Rizzy.toast.success("Item deleted.", "Deleted", {
  action: {
    label: "Undo",
    dismissOnClick: true,
    onClick: toast => restoreItem()
  }
});
```

Contract:

```js
{
  label: string,
  dismissOnClick?: boolean,
  onClick: (toastHandle) => void
}
```

Default `dismissOnClick` is true.

Catch and log callback failures:

```text
[RizzyUI] Toast action failed.
```

## 18. Dedupe

Rules:

```text
id present:
  update existing toast with same id

dedupeKey present:
  update existing toast with same dedupeKey

PreventDuplicates true:
  derive key from status + title + text + position

otherwise:
  create new toast
```

If both `id` and `dedupeKey` exist, `id` wins.

`incrementCount` may store count internally and include it in event detail. Visual display of count is optional in v1.

## 19. CSP and Security

- No `eval`.
- No `new Function`.
- No inline event handler attributes.
- No executable inline scripts.
- Use `textContent` for string content.
- Do not use `innerHTML` for user-provided content.
- Do not dynamically create Tailwind class names.
- Do not create `<style>` tags.
- Progress animation cannot be required for functional timing.

## 20. Dependency Removal

Remove `simple-notify` from `packages/rizzyui/package.json`.

Run `npm install` in `packages/rizzyui` after the dependency change.

Do not edit generated `dist` or copied `wwwroot` output manually.

## 21. Tests

### 21.1 .NET Tests

Add tests under the existing component test convention, likely:

```text
src/RizzyUI.Tests/Components/Feedback/RzToast/RzToastProviderTests.cs
```

Test:

- Root provider renders.
- Correct `data-slot` values.
- Nine viewports render.
- Nine stacks render.
- JSON config renders and parses.
- JSON includes defaults, slots, statuses, positions, tones, animations, states, aliases, icons.
- Provider parameters flow into JSON defaults.
- Simple Notify aliases are present.
- Theme override changes generated classes.
- Class map cache reuses equivalent inputs and separates distinct inputs.

### 21.2 JavaScript Tests

Use existing JS test setup.

Test:

- Provider registration.
- Stack registration by position.
- Missing provider warning.
- Existing facade methods.
- New methods.
- All Simple Notify position aliases.
- Position-specific insertion.
- Duplicate ID update.
- `dedupeKey` update.
- `PreventDuplicates`.
- Overflow strategies.
- Timers.
- Pause/resume behavior.
- Escape behavior.
- Action callback success/failure.
- `rz:` event API.
- Runtime does not construct Tailwind classes.

### 21.3 Accessibility Tests

Test:

- Non-error role/status polite.
- Error role/alert assertive.
- `aria-atomic`.
- Close button type and label.
- Action button keyboard reachability.
- Toast does not steal focus.
- Escape only dismisses focused toast.

## 22. Documentation

Create `ToastProviderInfo.razor`.

Include:

- Root layout placement.
- Provider parameter table.
- Basic usage examples.
- Existing compatibility usage.
- Multi-position examples.
- Loading/update examples.
- Dedupe example.
- Action example.
- `rz:` event examples.
- Theming through `Theme.RzToastProvider`.
- Accessibility contract.
- CSP notes.
- Migration notes from Simple Notify.
- Note that `promise()` is deferred.
- Note that `onShown`, `onUpdate`, `onDismiss` are not supported.

Update `ComponentList.razor` to include “Toast Provider” under the appropriate feedback section.

## 23. Acceptance Criteria

The implementation is complete when:

- `RzToastProvider` exists and renders correctly.
- No `RzToast` or `RzToastItem` component exists.
- `RzToastProviderStyles` exists and uses the style-provider pattern.
- `RzTheme.RzToastProvider` exists and is assigned.
- Provider emits class map JSON.
- Class map comes from `Theme.RzToastProvider`.
- Class maps are cached.
- JavaScript uses the class map for classes.
- JavaScript does not construct Tailwind classes.
- Existing `Rizzy.toast` API works.
- New `show/loading/update/dismiss/clear` methods work.
- All Simple Notify position aliases work.
- Simultaneous different-position toasts work.
- `simple-notify` is removed.
- Accessibility contract is implemented and tested.
- Docs page and nav entry exist.
- Build/tests pass or any remaining failures are documented with exact commands and reasons.
