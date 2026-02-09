### **The Definitive Guide to Authoring a RizzyUI Component (Version 3.3 - `data-slot` and TailwindVariants.NET Pattern)**

**Fully expanded specification for code-generation models — May 2025, rev 3.3**

---

## 0. Why this file exists

This guide is a **contract for any large-language model**—ChatGPT, Claude, Gemini, Azure OpenAI, etc.—that emits source code destined for the **RizzyUI** repository.
If the model follows every rule, a maintainer can:

1.  Paste the generated files into `src/RizzyUI/…`.
2.  Apply the indicated cross-file edits (see § 14).
3.  Run `dotnet build`.

The solution should compile, pass unit tests, and conform to RizzyUI’s conventions **without manual tweaks**.

SPECIAL NOTE: @* *@ comments in this document are used to provide LLM guidance only. They are **not** to be included in the generated code.

---

## 1. Output-file syntax (mandatory for new or replacement files)

When the user requests code, wrap each file in a single **`output` block** so automation scripts know where to save it.

````markdown
```output
<files>
  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor">
  <!-- Razor markup -->
  </file>

  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor.cs">
  <!-- C# code-behind -->
  </file>
</files>
```
````

*   Never nest `<files>` elements.
*   Always close every `<file>` tag.
*   If no new files are needed, **omit** the `output` block entirely.
*   Wrap the entire files response in a single markdown `output` block when generating multiple files.

---

## 2. Root element pattern (in every `.razor` file)

```razor
<HtmlElement Element="@EffectiveElement"
             id="@Id"
             @attributes="@AdditionalAttributes"
             class="@SlotClasses.GetBase()"
             data-slot="fancy-thing">
    @* Optional content here, like an Alpine child-container *@
</HtmlElement>
```

*   `Element="@EffectiveElement"` keeps the tag overridable (default "div" in `RzComponent`).
*   `@Id` is required for HTMX, Alpine, and tests.
*   `@SlotClasses.GetBase()` is supplied by the `TailwindVariants.NET` system in the code-behind.
*   `data-slot="component-name"` is a **mandatory** attribute. The value should be the kebab-case version of the component's name (e.g., `RzFancyThing` becomes `fancy-thing`).
*   **Always** convert enum values used as data- attributes into kebab-case (e.g. MyEnumProperty.ToString().ToKebabCase()).
*   **Always** write `@attributes="@AdditionalAttributes"` (note the leading `@`).
*   **Always place `@attributes` before `class`** on component root elements.
*   **Never** use @* *@ comments inside Razor markup for elements that will be rendered.
*   To change the `Element` type, override `OnInitialized()` in the code-behind. Set `Element` to the new type only if `Element` is empty or null.
    ```csharp
            if (string.IsNullOrEmpty(Element))
                Element = "nav";
    ```

---

## 3. `.razor` File Guidelines

*   **Namespace:** Add `@namespace RizzyUI`.
*   **Inheritance:** Add `@inherits RzComponent<ComponentName.Slots>` for non-generic components or `@inherits RzComponent<ComponentNameSlots>` for generic components.
*   **Component Naming Convention:**
    *   For **root-level components**, the component name MUST be prefixed with `Rz` (e.g., `RzDropdownMenu`).
    *   For **nested components**, the `Rz` prefix MUST be omitted (e.g., `DropdownMenuLabel`).
*   **Root Element:** Use the pattern in §2.
*   **CSS Classes and `data-slot` for Internal Elements:**
    *   Every HTML element *inside* the root element that receives styling from a slot **MUST** have both a `class` attribute and a `data-slot` attribute.
    *   The `class` attribute MUST use the source-generated `SlotClasses.Get...()` accessor (e.g., `class="@SlotClasses.GetIcon()"`).
    *   The `data-slot` attribute's value MUST be retrieved using the source-generated `SlotNames.NameOf(...)` helper. The syntax depends on whether the component is generic.
        *   **Non-Generic Components** (nested `Slots` class): `data-slot="@RzComponentName.SlotNames.NameOf(SlotTypes.SlotPropertyName)"`
            *   Example: `data-slot="@RzFancyThing.SlotNames.NameOf(SlotTypes.Icon)"`
        *   **Generic Components** (external `Slots` class): `data-slot="@ComponentNameSlotNames.NameOf(ComponentNameSlotTypes.SlotPropertyName)"`
            *   Example: `data-slot="@TableHeaderCellSlotNames.NameOf(TableHeaderCellSlotTypes.SortIndicator)"`
*   **Alpine Integration:** See §10 for the Alpine child-container convention if Alpine is used.
*   **Accessibility:** Refer to §8 for accessibility guidelines.
*   **Localization:** Refer to §9 for localization guidelines.

---

## 4. Code-behind skeleton (`.razor.cs`)

```csharp
// src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using Blazicons;
using TailwindVariants.NET;
// Add other necessary using statements

namespace RizzyUI;

/// <summary>
/// Brief description of RzFancyThing and its purpose.
/// </summary>
public partial class RzFancyThing : RzComponent<RzFancyThing.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzFancyThing component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center font-medium rounded",
        slots: new()
        {
            [s => s.Icon] = "size-5"
        },
        variants: new()
        {
            [c => ((RzFancyThing)c).Size] = new Variant<Size, Slots>
            {
                [Size.Small] = new() { [s => s.Base] = "text-xs py-1 px-2" },
                [Size.Medium] = new() { [s => s.Base] = "text-sm py-2 px-3" }
            },
            [c => ((RzFancyThing)c).IsActive] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.Base] = "ring-2 ring-primary" }
            }
        }
    );

    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public SvgIcon? Icon { get; set; }
    [Parameter] public Size Size { get; set; } = Size.Medium;
    [Parameter] public bool IsActive { get; set; }
    [Parameter] public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzFancyThing.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzFancyThing.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzFancyThing;

    /// <summary>
    /// Defines the slots available for styling in the RzFancyThing component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        [Slot("fancy-thing")]
        public string? Base { get; set; }
        [Slot("icon")]
        public string? Icon { get; set; }
    }
}
```

Important for the LLM:

*   Start with `/// <summary>...</summary>` for the class.
*   **All** public members get `<summary>` XML docs.
*   Inherit from `RzComponent<TSlots>` or `RzAsChildComponent<TSlots>`.
*   Define a `public sealed partial class Slots : ISlots` inside the component class for non-generic components.
*   **All properties in the `Slots` class MUST be decorated with the `[Slot("kebab-case-name")]` attribute.** The name should match `shadcn/ui` conventions where applicable.
*   For components inheriting from `RzAsChildComponent`, the `Base` slot's classes are merged onto the child element. The `[Slot(...)]` attribute is still required on the `Base` property in the `Slots` class.
*   Define a `public static readonly TvDescriptor<...>` with all base, slot, and variant styles.
*   Implement `protected override TvDescriptor<...> GetDescriptor() => Theme.ComponentName;`.
*   Handle default localized strings for parameters like `AriaLabel` (§9).

---

## 5. Icon-passing protocol

```razor
@* Inside RzFancyThing.razor *@
@if (Icon is not null)
{
    <Blazicon Svg="@Icon"
              class="@SlotClasses.GetIcon()"
              data-slot="@RzFancyThing.SlotNames.NameOf(SlotTypes.Icon)"
              aria-hidden="true" />
}
```

*   Accept icons as `SvgIcon?`.
*   Style the `<Blazicon>` using the source-generated `SlotClasses.Get...()` accessor.
*   Add the mandatory `data-slot` attribute using the `SlotNames.NameOf(...)` helper.
*   Add `aria-hidden="true"` if the icon is purely decorative.

---

## 6. Styling with TailwindVariants.NET

RizzyUI uses its own **Tailwind 4 plugin** that defines a palette of **CSS custom-property tokens** (e.g., `--background`, `--primary`).

### 6.1 Semantic tokens, not raw palette colors

You never hard-code `text-blue-600` or `bg-slate-900`. Instead, you write utilities that reference the semantic tokens:

```
bg-background
text-foreground
hover:bg-accent
ring-primary
```

Because the token names stay identical across light and dark modes, you do **not** need `dark:` prefixes for these semantic tokens.

### 6.2 Where utilities live

All styling logic—base classes, slot-specific classes, and conditional variants—belongs in the `TvDescriptor` defined within the component's `.razor.cs` or `Styling/ComponentNameStyles.cs` file.

### 6.3 Automatic Class Merging

The `RzComponent<TSlots>` base class automatically handles merging classes. The `TwVariants.Invoke` method combines classes from the `TvDescriptor` with any `class` attribute provided by the user on the component tag. You do not need to manually call `TwMerge`.

### 6.4 Defining Variants in the Descriptor

Variants are defined within the `variants` property of the `TvDescriptor`. They map a component parameter's value to a set of CSS classes.

```csharp
// In the TvDescriptor
variants: new()
{
    [c => ((RzFancyThing)c).Size] = new Variant<Size, Slots>
    {
        [Size.Small] = new() { [s => s.Base] = "text-xs py-1 px-2" },
        [Size.Medium] = new() { [s => s.Base] = "text-sm py-2 px-3" }
    }
}
```

### 6.5 Handling Nullable Enum Parameters in Variants

When a component `[Parameter]` is a **nullable enum** (e.g., `public SemanticColor? TextColor { get; set; }`), the corresponding `Variant` definition in the `TvDescriptor` **MUST** use the **non-nullable** enum type for its generic parameter. The library automatically handles `null` values by not applying a variant class.

**❌ WRONG:** The generic type `Variant<SemanticColor?, Slots>` is nullable.
```csharp
// This is incorrect and will cause issues.
[c => ((RzHeading)c).TextColor] = new Variant<SemanticColor?, Slots> { ... }
```

**✅ CORRECT:** The generic type `Variant<SemanticColor, Slots>` is non-nullable.
```csharp
// This is the correct pattern.
[c => ((RzHeading)c).TextColor] = new Variant<SemanticColor, Slots> { ... }
```

---

## 7. The TvDescriptor Pattern (Styling Providers)

The styling system is based on the `TvDescriptor`, which encapsulates all styling logic for a component. The implementation pattern differs depending on whether the component is generic.

### 7.1 For Non-Generic Components (Self-Contained Pattern)

For a non-generic component like `RzButton`, the `Slots` class and the `DefaultDescriptor` are defined directly within the component's `.razor.cs` file.

```csharp
// src/RizzyUI/Components/Form/RzButton/RzButton.razor.cs
public partial class RzButton : RzComponent<RzButton.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(/* ... */);

    // ... parameters ...

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzButton;

    public sealed partial class Slots : ISlots
    {
        [Slot("button")]
        public string? Base { get; set; }
    }
}
```

### 7.2 For Generic Components (External Styling Pattern)

If a component is generic (e.g., `TableHeaderCell<TItem>`) or requires decoupled styling, you **MUST** NOT define the `Slots` or `TvDescriptor` in the main `.razor.cs` file. Instead, use the External Styling Pattern.

**1. Create the Styles File:**
Create a file named `Styling/{ComponentName}Styles.cs` within the component's directory.

**2. Define Three Types in the Styles File:**
This file MUST contain exactly these three types:
*   **A Styling Interface:** `public interface IHas{ComponentName}StylingProperties` containing only the properties needed for variants.
*   **The Slots Class:** `public sealed partial class {ComponentName}Slots : ISlots` with all `[Slot]` decorated properties.
*   **A Static Styles Class:** `public static class {ComponentName}Styles` containing the `DefaultDescriptor`.

**Example: `Styling/TableHeaderCellStyles.cs`**

```csharp
using TailwindVariants.NET;

namespace RizzyUI;

// 1. Styling Interface
public interface IHasTableHeaderCellStylingProperties
{
    public bool Sortable { get; }
    public SortDirection CurrentSortDirection { get; }
}

// 2. Slots Class
public sealed partial class TableHeaderCellSlots : ISlots
{
    [Slot("table-header-cell")]
    public string? Base { get; set; }
    [Slot("sort-indicator")]
    public string? SortIndicator { get; set; }
}

// 3. Static Styles Class
public static class TableHeaderCellStyles
{
    public static readonly TvDescriptor<RzComponent<TableHeaderCellSlots>, TableHeaderCellSlots> DefaultDescriptor = new(
        @base: "...",
        variants: new()
        {
            // Cast to the interface in variant expressions
            [c => ((IHasTableHeaderCellStylingProperties)c).Sortable] = new Variant<bool, TableHeaderCellSlots> { ... }
        }
    );
}```

**3. Update the Component (`.razor.cs`):**
The component must then inherit from `RzComponent<{ComponentName}Slots>` and implement the styling interface.

```csharp
public partial class TableHeaderCell<TItem> : RzComponent<TableHeaderCellSlots>, IHasTableHeaderCellStylingProperties
{
    // ... implementation ...
    protected override TvDescriptor<RzComponent<TableHeaderCellSlots>, TableHeaderCellSlots> GetDescriptor() => Theme.TableHeaderCell;
}
```

---

## 8. Accessibility Best Practices

Ensuring components are accessible is paramount. LLMs must generate components that strive to adhere to WCAG standards where applicable.

*   **Semantic HTML:**
    *   Use the most appropriate HTML element for the component's role. The `Element` property in `RzComponent` (defaulting to "div") should be overridden in `OnInitialized()` if a more semantic tag like `<nav>`, `<button>`, `<aside>`, etc., is suitable.
    *   Example: A navigation component should use `<nav>`, a button should use `<button>` or `<a>` with `role="button"`.

*   **ARIA Attributes:**
    *   **Roles:** Apply appropriate `role` attributes (e.g., `role="alert"`, `role="dialog"`, `role="menuitem"`, `role="tab"`, `role="switch"`). The root element pattern in §2 can have its `role` set via `AdditionalAttributes` or directly if static.
    *   **Labels & Descriptions:**
        *   Every interactive component MUST have an accessible name. This is typically provided via an `AriaLabel` parameter in the `.razor.cs` file. If the component has visible text that serves as its label, ensure it's associated (e.g., `<label for="...">` for form inputs, or `aria-labelledby` pointing to the ID of the visible text element).
        *   Use `aria-label` for concise labels when visible text is insufficient or absent (e.g., icon-only buttons).
        *   Use `aria-labelledby` to associate the component with existing visible text that acts as its label.
        *   Use `aria-describedby` to associate the component with descriptive text that provides more context.
    *   **States & Properties:** Use ARIA attributes to convey state:
        *   `aria-expanded` (for accordions, dropdowns, collapsible sections)
        *   `aria-selected` (for tabs, items in a listbox)
        *   `aria-current` (for pagination, breadcrumbs, steps - e.g., `aria-current="page"` or `aria-current="step"`)
        *   `aria-pressed` (for toggle buttons)
        *   `aria-hidden` (use judiciously, e.g., for purely decorative icons or off-screen content)
        *   `aria-modal="true"` (for modal dialogs)
        *   `aria-live` (for dynamic content updates, e.g., alerts, status messages)
        *   `aria-controls` (to link a control to the region it manages)
        *   For inputs: `aria-required`, `aria-invalid`.

*   **Keyboard Navigation & Focus Management:**
    *   All interactive elements MUST be keyboard operable.
    *   Use `tabindex="0"` for custom interactive elements that should be in the tab order.
    *   Use `tabindex="-1"` for elements that should be programmatically focusable but not in the default tab order.
    *   For composite widgets (like dropdowns, menus, tabs), implement appropriate keyboard navigation patterns (arrow keys, Home/End, Enter/Space). This is often handled by the Alpine.js logic.
    *   Ensure a visible focus indicator. RizzyUI themes generally provide this, but be mindful if overriding default focus styles.
    *   For modals and dropdowns that trap focus, use Alpine's `x-trap.inert="isOpen"` directive.

*   **Screen Reader Text:**
    *   Use the `sr-only` Tailwind class (or equivalent CSS) for text that should only be available to screen readers (e.g., providing context for an icon button).
        ```razor
        <button aria-label="@Localizer["RzComponentName.CloseButtonAriaLabel"]">
            <Blazicon Svg="@MdiIcon.Close" aria-hidden="true" />
            <span class="sr-only">@Localizer["RzComponentName.CloseButtonSrText"]</span> @* Alternative if aria-label isn't sufficient *@
        </button>
        ```

*   **Images & Icons:**
    *   Decorative icons should have `aria-hidden="true"`.
    *   Informative icons (if not accompanied by text) need an accessible label (e.g., via `aria-label` on the button or a `sr-only` span).
    *   Images (e.g., `RzAvatar`) must have meaningful `alt` text or `aria-label`.

*   **Forms:**
    *   Associate labels with form controls using `<label for="...">` and matching `id` on the input. `RzFieldLabel` handles this if `For` is provided.
    *   Use `fieldset` and `legend` for groups of related controls (e.g., radio button groups).
    *   Provide clear validation messages, associated with inputs using `aria-describedby`. `RzValidationMessage` typically handles this.

---

## 9. Localization

All user-facing strings within components (default labels, ARIA labels, titles, placeholders, etc.) MUST be localizable.

*   **Accessing Localizer:**
    *   The `RzComponent` base class injects `IStringLocalizer<RizzyLocalization> Localizer`. Use this to retrieve localized strings.

*   **Resource Key Convention:**
    *   Resource keys should follow the pattern: `ComponentName.ResourceKeyName`.
    *   Example: For a default ARIA label in `RzFancyThing`, the key would be `RzFancyThing.DefaultAriaLabel`.
    *   Example: For a "Close" button text, `RzModal.CloseButtonText`.

*   **Parameter Defaults & Localization:**
    *   Component parameters that accept user-facing strings (e.g., `AriaLabel`, `Title`, `Placeholder`) should allow users to provide their own values.
    *   If the user does *not* provide a value for such a parameter (i.e., it remains `null` or its default), the component should attempt to load a localized default string.
    *   This is typically done in `OnInitialized()` and/or `OnParametersSet()`:
        ```csharp
        // In RzFancyThing.razor.cs
        [Parameter] public string? AriaLabel { get; set; }
        [Parameter] public string? PlaceholderText { get; set; }

        protected override void OnInitialized()
        {
            base.OnInitialized();
            AriaLabel ??= Localizer["RzFancyThing.DefaultAriaLabel"];
            PlaceholderText ??= Localizer["RzFancyThing.DefaultPlaceholder"];
        }

        protected override void OnParametersSet()
        {
            base.OnParametersSet();
            // If parameters can be changed after init and might become null
            AriaLabel ??= Localizer["RzFancyThing.DefaultAriaLabel"];
            PlaceholderText ??= Localizer["RzFancyThing.DefaultPlaceholder"];
        }
        ```

*   **Providing New Resource Strings (LLM Output):**
    *   When generating a new component that introduces new localizable strings, the LLM MUST provide the English (default culture) versions of these strings.
    *   These should be presented in a clear key-value format, suitable for a developer to copy into the `src/RizzyUI/Resources/RizzyLocalization.resx` file.
    *   This information should be provided *outside* the main ````output ... ```` block, typically alongside the "Manual Edits Required for Theme Integration" section.

    **Example Presentation for New Resource Strings:**

    ````markdown
    **New English Localization Strings for `RizzyLocalization.resx`:**

    Please add the following entries to `src/RizzyUI/Resources/RizzyLocalization.resx`:

    | Name                               | Value                         | Comment (Optional)                  |
    |------------------------------------|-------------------------------|-------------------------------------|
    | `RzFancyThing.DefaultAriaLabel`    | `Fancy interactive element`   | `Default ARIA label for RzFancyThing` |
    | `RzFancyThing.DefaultPlaceholder`  | `Enter fancy text here...`    | `Placeholder for RzFancyThing input`  |
    | `RzAnotherComponent.SomeText`      | `Another default string`      |                                     |

    Alternatively, in raw .resx XML format:
    ```xml
    <data name="RzFancyThing.DefaultAriaLabel" xml:space="preserve">
      <value>Fancy interactive element</value>
      <comment>Default ARIA label for RzFancyThing</comment>
    </data>
    <data name="RzFancyThing.DefaultPlaceholder" xml:space="preserve">
      <value>Enter fancy text here...</value>
      <comment>Placeholder for RzFancyThing input</comment>
    </data>
    <data name="RzAnotherComponent.SomeText" xml:space="preserve">
      <value>Another default string</value>
    </data>
    ```
    ````

---

## 10. Alpine.js Integration & Asset Bundling

RizzyUI components that require client-side interactivity leverage Alpine.js. The integration follows a specific pattern for defining components, managing their assets, and ensuring CSP compliance.

### 10.1 Alpine.js API Restrictions (CSP Build)

**It is CRITICAL to understand and adhere to these API restrictions when writing Alpine.js code for RizzyUI components.** Since Alpine.js, when built for Content Security Policy (CSP) compliance, can no longer interpret strings as plain JavaScript, it has to parse and construct JavaScript functions from them manually.

Due to this limitation, you **MUST** use `Alpine.data` to register your `x-data` objects, and **MUST** reference properties and methods from it by key only.

For example, an inline component like this **will not work** with the CSP build:

```html
<!-- Bad -->
<div x-data="{ count: 1 }">
    <button @click="count++">Increment</button>
    <span x-text="count"></span>
</div>
```

However, breaking out the expressions into external APIs, the following is **valid** with the CSP build:

```html
<!-- Good -->
<div x-data="counter">
    <button @click="increment">Increment</button>
    <span x-text="count"></span>
</div>
```

```javascript
Alpine.data('counter', () => ({
    count: 1,
    increment() {
        this.count++
    },
}))
```

The CSP build supports accessing nested properties (property accessors) using the dot notation:

```html
<!-- This works too -->
<div x-data="counter">
    <button @click="foo.increment">Increment</button>
    <span x-text="foo.count"></span>
</div>
```

```javascript
Alpine.data('counter', () => ({
    foo: {
        count: 1,
        increment() {
            this.count++
        },
    },
}))
```

**Key Takeaways for LLMs:**
*   **Always use `Alpine.data`** for `x-data` definitions. Never inline `x-data` objects.
*   **Reference properties and methods by key only** (e.g., `increment`, `count`, `foo.increment`). Avoid complex inline expressions like `count++`, `isActive = !isActive`, or `myFunction(param1, param2)`. Instead, encapsulate such logic within methods defined in your `Alpine.data` object.
*   Dot notation for nested properties is allowed.

### 10.2 Alpine Child-Container Convention (in `.razor` file)

If a RizzyUI component uses Alpine.js, its root `<HtmlElement>` in the `.razor` file MUST contain a direct child `<div>` with the following attributes. This `div` serves as the root for the Alpine component.

```razor
<HtmlElement Element="@EffectiveElement" id="@Id" @attributes="@AdditionalAttributes" class="@SlotClasses.GetBase()">
    <div data-alpine-root="@Id" @* Crucial: Must match the Blazor component's @Id *@
         x-data="rzFancyThing"   @* Alpine component name, e.g., 'rzComponentName' *@
         data-assets="@_assets"   @* Serialized JSON string of asset URLs for this component *@
         data-nonce="@Nonce">     @* CSP nonce for inline scripts/styles loaded by this component *@
        @* Alpine-interactive content, x-ref, x-on:, :class, etc. goes here *@
    </div>
</HtmlElement>
```

*   `data-alpine-root="@Id"`: This attribute is **essential**. It MUST exactly match the Blazor component's `@Id`. It's used by the `Rizzy.$data()` helper to locate the Alpine component's scope.
*   `x-data="rzComponentName"`: Specifies the name of the Alpine.js component to initialize on this `div`. The name should follow the `rzComponentName` convention, where `rz` corresponds to `Rz` prefixed Blazor components.
*   `data-assets="@_assets"`: A JSON stringified array of asset URLs (JavaScript/CSS) that this specific Alpine component instance needs. This is populated from the C# code-behind.
*   `data-nonce="@Nonce"`: The CSP nonce value, passed from the C# `RzComponent` base. This is used by the `require` utility to load assets in a CSP-compliant manner.

### 10.3 Asset Declaration and Loading (Centralized)

Components **do not** hardcode asset URLs. Instead, they declare their dependencies using logical keys, which are resolved to URLs from a central configuration.

1.  **Define Asset Keys (`.razor.cs`):**
    *   The component defines a `ComponentAssetKeys` parameter, which is a `string[]`. This parameter should have a default value containing the logical keys for its required assets.
    *   Example:
        ```csharp
        // In RzFancyThing.razor.cs
        [Parameter]
        public string[] ComponentAssetKeys { get; set; } = ["FancyThingCoreScript", "SomeOtherDependency"];
        ```

2.  **Inject Configuration (`.razor.cs`):**
    *   The component injects `IOptions<RizzyUIConfig>` to access the central asset URL mapping.
        ```csharp
        // In RzFancyThing.razor.cs
        [Inject]
        private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;
        ```

3.  **Resolve and Serialize URLs (`.razor.cs`):**
    *   A private method (e.g., `UpdateAssets`) is called in `OnInitialized` and `OnParametersSet`.
    *   This method looks up the URLs for each key in `ComponentAssetKeys` from `RizzyUIConfig.Value.AssetUrls`.
    *   The resolved URLs are serialized into a JSON string and stored in a private field (e.g., `_assets`), which is then bound to the `data-assets` attribute in the Razor markup.
        ```csharp
        // In RzFancyThing.razor.cs
        private string _assets = "[]";

        private void UpdateAssets()
        {
            var assetUrls = ComponentAssetKeys
                .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
                .Where(url => !string.IsNullOrEmpty(url))
                .ToList();
            _assets = System.Text.Json.JsonSerializer.Serialize(assetUrls);
        }
        ```

### 10.4 Alpine Component Definition (Individual JavaScript File)

*   Each new Alpine component (e.g., `rzFancyThing`) MUST have its logic defined in a **new, separate JavaScript file**.
*   Location: `packages/rizzyui/src/js/lib/components/rzFancyThing.js` (replace `rzFancyThing` with the actual component name).
*   This file MUST export a default function.
    *   The first argument to this function will always be the `Alpine` instance.
    *   If the component needs to dynamically load assets (using the `data-assets` attribute), the function should accept `require` as a second argument. This `require` is the `rizzyRequire` utility provided by `components.js`.
*   Inside this exported function, the Alpine component is defined using `Alpine.data('rzFancyThing', () => ({ /* component logic */ }));`. The name used here (e.g., `'rzFancyThing'`) MUST match the `x-data` attribute in the Razor markup.
*   The `init()` method within the Alpine data object is typically responsible for:
    1.  Retrieving `assetsToLoad` by parsing `this.$el.dataset.assets`.
    2.  Retrieving `nonce` from `this.$el.dataset.nonce`.
    3.  If `assetsToLoad` is not empty and the `require` function was passed in, call `require(assetsToLoad, { success: callback, error: errCallback }, nonce)`.
    4.  Place any Alpine initialization logic that *depends* on these external assets (e.g., initializing a third-party library like Flatpickr or Highlight.js) inside the `success` callback of `require`.
    5.  Other initialization logic (e.g., setting up internal state, watchers) can be placed directly in `init()` or in a separate method called from `init()` (either before or after `require`, or within its callbacks, as appropriate).

**Example: `packages/rizzyui/src/js/lib/components/rzFancyThing.js`**

```javascript
// This component demonstrates conditional asset loading.
// If data-assets is empty or 'require' is not provided, it proceeds without loading.
export default function(Alpine, require) { // 'require' is optional here
    Alpine.data('rzFancyThing', () => ({
        someProperty: 'initialValue',
        assetsLoaded: false,

        init() {
            const assetsToLoad = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce || '';
            const self = this; // Retain 'this' context for callbacks

            // Example: Read an initial value from a data attribute
            this.someProperty = this.$el.dataset.initialFancyValue || 'default fancy value';

            if (assetsToLoad.length > 0 && typeof require === 'function') {
                console.log(`rzFancyThing (${this.$el.id}): Attempting to load assets:`, assetsToLoad);
                require(assetsToLoad, {
                    success: function() {
                        console.log(`rzFancyThing (${self.$el.id}): Assets loaded successfully.`);
                        self.assetsLoaded = true;
                        // Example: Initialize a library if 'some-library.js' was loaded
                        // if (window.SomeLibrary) {
                        //     self.libraryInstance = new window.SomeLibrary(self.$el.querySelector('.target-for-lib'));
                        // }
                        self.setupInteractivity(); // Call main logic after assets
                    },
                    error: function(err) {
                        console.error(`rzFancyThing (${self.$el.id}): Failed to load assets.`, err);
                        // Decide if setupInteractivity should still run or if it's critical
                        self.setupInteractivity(); // Or handle error state
                    }
                }, nonce);
            } else {
                // No assets to load, or 'require' function not available/needed by this component.
                // Proceed with non-asset-dependent setup.
                console.log(`rzFancyThing (${this.$el.id}): No assets to load or require not provided.`);
                self.setupInteractivity();
            }
        },

        setupInteractivity() {
            // Main Alpine logic that runs (potentially after assets are loaded)
            console.log(`rzFancyThing (${this.$el.id}): Setting up interactivity. Current someProperty:`, this.someProperty);
            
            // Example: Watch for changes to 'someProperty'
            // this.$watch('someProperty', (value) => {
            //    console.log(`rzFancyThing (${this.$el.id}): someProperty changed to:`, value);
            // });
        },

        updateFancyProperty(newValue) {
            this.someProperty = newValue;
        }
        // ... other methods and properties for rzFancyThing
    }));
}
```

### 10.5 Alpine Component Registration (in `packages/rizzyui/src/js/lib/components.js`)

*   The newly created component registration function (e.g., `registerRzFancyThing` which is the default export from `rzFancyThing.js`) MUST be imported into `packages/rizzyui/src/js/lib/components.js`.
*   It must then be called within the `registerComponents(Alpine)` function in `components.js`. Pass the `Alpine` instance. If the component's registration function (e.g., `export default function(Alpine, require)`) expects the `require` utility, pass `rizzyRequire` (which is `loadjs` aliased as `require` in this file) as the second argument.

**Example: Modifying `packages/rizzyui/src/js/lib/components.js`**

```javascript
// packages/rizzyui/src/js/lib/components.js
import loadjs from "./loadjs/loadjs.js"; // Underlying asset loader

// ... other existing component imports ...
import registerRzAccordion from './components/rzAccordion.js';
import registerRzFancyThing from './components/rzFancyThing.js'; // <-- NEW IMPORT

// ... (rizzyRequire function definition using loadjs) ...
// async function generateBundleId(paths) { ... }
// function rizzyRequire(paths, callbackFn, nonce) { ... }


function registerComponents(Alpine) {
    // ... other existing component registrations ...
    registerRzAccordion(Alpine); // Example of a component not needing 'require'
    
    // Register the new component.
    // Pass 'rizzyRequire' if its definition function expects it.
    registerRzFancyThing(Alpine, rizzyRequire); // <-- NEW REGISTRATION
}

export { registerComponents, rizzyRequire as require };
```

---

## 11. Unit tests (bUnit) (IMPORTANT: ONLY ON REQUEST)

When unit tests are specifically requested for a new or modified component, they should be generated using bUnit and adhere to the following guidelines. Tests ensure component correctness, accessibility, and integration with the RizzyUI theme system and Alpine.js patterns.

*   **File Location and Naming:**
    *   Test files should reside in the `src/RizzyUI.Tests/Components/` directory, mirroring the component's path under `src/RizzyUI/Components/`.
    *   Example: For `src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor`, the test file would be `src/RizzyUI.Tests/Components/Fancy/RzFancyThingTests.cs`.
    *   Use file-scoped namespaces matching the directory structure within the test project (e.g., `namespace RizzyUI.Tests.Components.Fancy;`).

*   **Test Class Structure:**
    *   Test classes MUST inherit from `BunitAlbaContext`.
    *   Test classes MUST implement `IClassFixture<WebAppFixture>`.
    *   The constructor MUST accept a `WebAppFixture` parameter and pass it to the `base(fixture)` constructor.
    *   The `WebAppFixture` (via `BunitAlbaContext`) handles the setup of essential services like `IHttpContextAccessor`, `IRizzyNonceProvider`, and automatically calls `AddRizzyUI()`, which registers `TwMerge` and the default `RzTheme`.

    ```csharp
    // Example: src/RizzyUI.Tests/Components/Fancy/RzFancyThingTests.cs
    using Bunit;
    using Microsoft.AspNetCore.Components; // For RenderFragment, etc.
    using RizzyUI.Components.Fancy.RzFancyThing; // Import the component being tested
    // Add other necessary using statements (e.g., Blazicons, System.Linq.Expressions)

    namespace RizzyUI.Tests.Components.Fancy; // File-scoped namespace

    public class RzFancyThingTests : BunitAlbaContext, IClassFixture<WebAppFixture>
    {
        // private readonly IAlbaHost _host; // Only needed if testing HTTP interactions via Alba

        public RzFancyThingTests(WebAppFixture fixture) : base(fixture)
        {
            // _host = fixture.Host; // Store if needed for Alba HTTP tests
            // Services.AddRizzyUI(); // This is ALREADY CALLED by WebAppFixture, no need to call again.
        }

        // ... Test methods ...
    }
    ```

*   **Test Method Guidelines (`[Fact]` or `[Theory]`):**

    1.  **Default Render Test:**
        *   Render the component with minimal or no parameters (or only required ones like `Id`).
        *   Assert the root element exists and has the correct default tag (e.g., `div` unless overridden).
        *   Verify the `Id` is correctly applied.
        *   Assert that `cut.Find("selector").ClassList` contains the expected base classes from the `DefaultDescriptor`.
        *   Assert default ARIA attributes (e.g., `role`, default `aria-label` if applicable from localization).
        *   If the component uses Alpine.js:
            *   Assert the presence of the Alpine child-container (`div[data-alpine-root='@Id']`).
            *   Assert `x-data` attribute matches the component's Alpine module name.
            *   Assert `data-assets` attribute is present and contains the JSON serialized URLs resolved from the default `ComponentAssetKeys`.
            *   Assert `data-nonce` attribute is present.

    2.  **Parameter Variation Tests:**
        *   For each significant parameter, create tests to verify its effect on rendering.
        *   **CSS Classes:** Use `cut.Find("selector").ClassList.Contains("expected-class")`. Verify that dynamic style provider methods (e.g., `GetSizeCss`, `GetVariantCss`) are correctly applying classes.
        *   **ARIA Attributes:** Assert that ARIA attributes change correctly based on parameters (e.g., `aria-expanded`, `aria-pressed`, `aria-current`).
        *   **Conditional Rendering:** Assert elements are rendered or hidden based on boolean parameters (e.g., `ShowIcon`, `Dismissable`).
        *   **Content Parameters:**
            *   Test `Label` parameter vs. `ChildContent` precedence if applicable.
            *   Verify `RenderFragment` parameters like `ChildContent`, `LeadingIcon`, `TrailingIcon`, `HeaderContent`, `FooterContent` are rendered correctly.
            *   For icons (`SvgIcon?`), assert that `<Blazicon Svg="@IconParameter" ... />` is rendered with appropriate classes and `aria-hidden="true"` if decorative.

    3.  **Accessibility Tests:**
        *   Explicitly verify that `AriaLabel` parameter, when set, overrides any default.
        *   Verify that if `AriaLabel` is *not* set, the component applies a default localized ARIA label (retrieved via `Localizer["ComponentName.DefaultAriaLabel"]`).
        *   Check for other critical ARIA attributes relevant to the component's role.

    4.  **Interaction Tests (if applicable):**
        *   For interactive components (e.g., buttons, toggles), simulate user actions:
            *   `cut.Find("button").Click()`
            *   `cut.Find("input").Change("new value")`
        *   Assert that `EventCallback` parameters are invoked.
        *   Assert that component state (if exposed or reflected in markup/ARIA) changes as expected.

    5.  **Styling and `AdditionalAttributes`:**
        *   Verify that classes passed via `AdditionalAttributes` (e.g., `<RzFancyThing class="my-custom-style">`) are correctly merged into the root element's class list.
        *   Verify other `AdditionalAttributes` are passed through to the root element.

    6.  **Localization of Defaults:**
        *   Test that default text values (e.g., for `AriaLabel`, `Placeholder`, `Title` if not provided by user) are correctly sourced from `Localizer["ComponentName.ResourceKey"]`.

*   **bUnit Assertions:**
    *   Use `cut.Find("css-selector")` to locate elements.
    *   Use `element.MarkupMatches("expected html")` for precise structural and attribute checks. Use `diff.MissingAttributes` or `diff.MissingChildren` from the diff result for debugging.
    *   Use `element.ClassList` for asserting CSS classes.
    *   Use `element.GetAttribute("attribute-name")` for asserting attribute values.
    *   Use `cut.Instance` to access the component instance's properties and methods if needed (e.g., to check the `_assets` field).

*   **Output Format:**
    *   When tests are requested, the generated `.cs` test file(s) should be included within the `<files>` block of the ````output ... ```` section, just like component files.

---

## 12. The output block example (canonical)

When asked to generate `RzFancyThing` (a non-generic component):

```output
<files>
  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor">…</file>
  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor.cs">…</file>
</files>
```

When asked to generate `RzGenericThing<TItem>`:

```output
<files>
  <file path="src/RizzyUI/Components/Generic/RzGenericThing/RzGenericThing.razor">…</file>
  <file path="src/RizzyUI/Components/Generic/RzGenericThing/RzGenericThing.razor.cs">…</file>
  <file path="src/RizzyUI/Components/Generic/RzGenericThing/Styling/RzGenericThingStyles.cs">…</file>
</files>
```

---

## 13. What **not** to place in the `output` block

Changes to **global theme scaffolding** (`RzTheme.cs`, `RzTheme.StyleProviders.cs`), **configuration** (`RizzyUIConfig.cs`, `ServiceCollectionExtensions.cs`), and **localization resource files** (`RizzyLocalization.resx`) go in a **separate, preface section** that appears *before* the `output` block.
That section must identify each existing file and show the lines/entries to insert, either as a diff or as verbatim code snippets/tables.
Never embed these edits in `<file>` tags because CI merges them manually.

---

## 14. Theme, Localization, and Asset Integration (cross-file edits)

Whenever a new component is introduced, instruct the user accordingly:

**Manual Edits Required for Integration:**

**Theme Integration:**

1.  **Add to `src/RizzyUI/RzTheme.StyleProviders.cs`**:
    ```csharp
    // For a non-generic component
    public virtual TvDescriptor<RzComponent<RzFancyThing.Slots>, RzFancyThing.Slots> RzFancyThing { get; set; }

    // For a generic component
    public virtual TvDescriptor<RzComponent<RzGenericThingSlots>, RzGenericThingSlots> RzGenericThing { get; set; }
    ```

2.  **Add to `src/RizzyUI/RzTheme.cs` constructor**:
    ```csharp
    // For a non-generic component
    RzFancyThing = RizzyUI.RzFancyThing.DefaultDescriptor;

    // For a generic component
    RzGenericThing = RizzyUI.RzGenericThingStyles.DefaultDescriptor;
    ```

**Localization:**

Please add the following English (default culture) entries to `src/RizzyUI/Resources/RizzyLocalization.resx`:

| Name                               | Value                         | Comment (Optional)                  |
|------------------------------------|-------------------------------|-------------------------------------|
| `RzFancyThing.DefaultAriaLabel`    | `Fancy interactive element`   | `Default ARIA label for RzFancyThing` |

**Asset Management Integration:**

Please add the following default asset URLs to the `PostConfigure` action in `src/RizzyUI/Extensions/ServiceCollectionExtensions.cs`:

| Key (`string`)           | URL (`string`)                                       |
|--------------------------|------------------------------------------------------|
| `"FancyThingCoreScript"` | `"https://cdn.jsdelivr.net/npm/fancylib@1.2.3/dist/fancy.min.js"` |

**JavaScript Integration (if new Alpine component `rzFancyThing` was created):**

1.  **Modify `packages/rizzyui/src/js/lib/components.js`**:
    *   Add an import statement for your new component module at the top of the file:
        ```javascript
        import registerRzFancyThing from './components/rzFancyThing.js'; 
        ```
    *   Call the imported registration function within the `registerComponents(Alpine)` function:
        ```javascript
        function registerComponents(Alpine) {
            // ...
            registerRzFancyThing(Alpine, rizzyRequire); 
        }
        ```

---

## 15. Final checklist for the LLM

*   CRITICAL - Only generate or modify code directly related to the task requested. You are not permitted to modify code outside the scope of the request.
*   **Component Naming:** Ensure only root-level components are prefixed with `Rz`.
*   Prepend the cross-file edit instructions for theme, localization, and asset management if needed (§14).
*   Provide an `output` block for new or replaced component-specific files only (§1, §12).
*   Use the root element pattern (§2) and Alpine child-container convention if Alpine is used (§10.2).
*   `.razor` files: Use `@inherits RzComponent<...>` and `SlotClasses.Get...()` for all classes (§3, §5).
*   `.razor.cs` files:
    *   Start with `/// <summary>...</summary>` for the class and public members.
    *   Inherit from `RzComponent<TSlots>` or `RzAsChildComponent<TSlots>`.
    *   **For non-generic components:** Define `Slots` and `DefaultDescriptor` inside the class.
    *   **For generic components:** Implement the `IHas...StylingProperties` interface.
    *   Implement `protected override TvDescriptor<...> GetDescriptor() => Theme.ComponentName;`.
    *   **Ensure `RootClass()` method is NOT present.**
    *   Handle default localized strings for parameters like `AriaLabel` (§9).
*   Styling files (`Styling/ComponentNameStyles.cs` for generics):
    *   Define the non-generic `Slots` class.
    *   Define the `static class` containing the `DefaultDescriptor`.
    *   Variant expressions in the descriptor **MUST** cast to the `IHas...StylingProperties` interface.
*   Alpine.js: Strictly adhere to API restrictions by always using `Alpine.data` and referencing properties/methods by key only.
*   Include unit tests *only* when specifically requested (§11).
*   Adhere to all specified conventions and avoid manual concatenation of class strings.
*   Do not include comments in Razor markup or using statements. Any comments in code blocks should be production-ready.

---

### **Final Sign-Off Checklist (Version 3.3)**

#### **Part A: LLM Automated Verification Checklist**

-   **[ ] 1. `Slots` Class Definition:**
    -   For **non-generic** components: The `.razor.cs` file contains a `public sealed partial class Slots : ISlots`.
    -   For **generic** components: The `Styling/{ComponentName}Styles.cs` file contains a `public sealed partial class {ComponentName}Slots : ISlots`.
-   **[ ] 2. `Slots` Properties:** The `Slots` class has a `string?` property for *every* slot consumed by a `SlotClasses.Get...()` call in the `.razor` file.
-   **[ ] 3. `[Slot]` Attribute:** Every property in every `Slots` class is decorated with `[Slot("kebab-case-name")]`.
-   **[ ] 4. `DefaultDescriptor` Location:**
    -   For **non-generic** components: The `.razor.cs` file contains a `public static readonly TvDescriptor`.
    -   For **generic** components: The `Styling/{ComponentName}Styles.cs` file contains a `public static class {ComponentName}Styles` holding the `public static readonly TvDescriptor`.
-   **[ ] 5. Descriptor Completeness:** The `DefaultDescriptor` provides a default class string for *every* slot defined in the `Slots` class.
-   **[ ] 6. Interface Implementation (Generic Components Only):** For generic components, the component's `.razor.cs` file **implements** the `IHas...StylingProperties` interface.
-   **[ ] 7. Styling File Structure (Generic Components Only):** The `Styling/{ComponentName}Styles.cs` file exists and contains the styling interface, the slots class, and the static styles class.
-   **[ ] 8. Correct Variant Syntax:** All `variants` and `compoundVariants` that target a slot other than `Base` **MUST** use the `new() { [s => s.SlotName] = "..." }` syntax. For generic components, variant expressions **MUST** cast the component instance to the styling interface (e.g., `c => ((IHas...StylingProperties)c).PropertyName`).
-   **[ ] 9. Nullable Enum Variant Type:** For nullable enum `[Parameter]`s used in variants, the `Variant<T, TSlots>` definition uses the **non-nullable** enum type for `T`.
-   **[ ] 10. Inheritance:** The component's `.razor.cs` file inherits from `RzComponent<TSlots>` or `RzAsChildComponent<TSlots>`, where `TSlots` is the correct (and possibly non-generic) slots type.
-   **[ ] 11. Correct `GetDescriptor` Implementation:** The component's `.razor.cs` file **MUST** contain the method `protected override TvDescriptor<...> GetDescriptor() => Theme.ComponentName;`.
-   **[ ] 12. `RootClass()` Method Removed:** The `RootClass()` method has been completely removed from the component's `.razor.cs` file.
-   **[ ] 13. Markup Inheritance:** The component's `.razor` file has the correct `@inherits` directive.
-   **[ ] 14. Markup Class Attributes:** All `class` attributes in the `.razor` file have been updated to use the `SlotClasses.Get...()` accessors.
-   **[ ] 15. `data-slot` on Root Element:** The root `HtmlElement` has a `data-slot="component-name"` attribute with a hardcoded, kebab-case name.
-   **[ ] 16. `data-slot` on Internal Elements:** Every internal element with a `class="@SlotClasses.Get...()"` attribute also has a corresponding `data-slot="@...SlotNames.NameOf(...)"` attribute.
-   **[ ] 17. Alpine Directives Preserved:** All non-class Alpine directives are present in the `.razor` file on their original elements.

#### **Part B: Human Developer Validation Checklist**

-   **[ ] 18. Theme Integration:** Have the manual edits to `RzTheme.StyleProviders.cs` and `RzTheme.cs` been applied correctly?
-   **[ ] 19. Obsolete Files Deleted:** Have the old `Default...Styles.cs` and `RzStylesBase...cs` files for the component been deleted?
-   **[ ] 20. Build Success:** Does the entire `RizzyUI` solution build without errors?
-   **[ ] 21. Unit Tests:** Do all existing unit tests for the component pass?
-   **[ ] 22. Demo Application:** Visually confirm that the component renders and behaves exactly as it did before the refactor in the `RizzyUI.Docs` application.