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

* `Element="@EffectiveElement"` keeps the tag overridable (default "div" in `RzComponent`).
* `@Id` is required for HTMX, Alpine, and tests.
* `@SlotClasses.GetBase()` is supplied by the `TailwindVariants.NET` system in the code-behind.
* `data-slot="component-name"` is a **mandatory** attribute. The value should be the kebab-case version of the component's name (e.g., `RzFancyThing` becomes `fancy-thing`).
* **Always** convert enum values used as data- attributes into kebab-case (e.g. MyEnumProperty.ToString().ToKebabCase()).
* **Always** write `@attributes="@AdditionalAttributes"` (note the leading `@`).
* **Always place `@attributes` before `class`** on component root elements.
* **Never** use @* *@ comments inside Razor markup for elements that will be rendered.
* To change the `Element` type, override `OnInitialized()` in the code-behind. Set `Element` to the new type only if `Element` is empty or null.

  ```csharp
          if (string.IsNullOrEmpty(Element))
              Element = "nav";
  ```

---

## 3. `.razor` File Guidelines

* **Namespace:** Add `@namespace RizzyUI`.
* **Inheritance:** Add `@inherits RzComponent<ComponentName.Slots>` for non-generic components or `@inherits RzComponent<ComponentNameSlots>` for generic components.
* **Component Naming Convention:**

  * For **root-level components**, the component name MUST be prefixed with `Rz` (e.g., `RzDropdownMenu`).
  * For **nested components**, the `Rz` prefix MUST be omitted (e.g., `DropdownMenuLabel`).
* **Root Element:** Use the pattern in §2.
* **CSS Classes and `data-slot` for Internal Elements:**

  * Every HTML element *inside* the root element that receives styling from a slot **MUST** have both a `class` attribute and a `data-slot` attribute.
  * The `class` attribute MUST use the source-generated `SlotClasses.Get...()` accessor (e.g., `class="@SlotClasses.GetIcon()"`).
  * The `data-slot` attribute's value MUST be retrieved using the source-generated `SlotNames.NameOf(...)` helper. The syntax depends on whether the component is generic.

    * **Non-Generic Components** (nested `Slots` class): `data-slot="@RzComponentName.SlotNames.NameOf(SlotTypes.SlotPropertyName)"`

      * Example: `data-slot="@RzFancyThing.SlotNames.NameOf(SlotTypes.Icon)"`
    * **Generic Components** (external `Slots` class): `data-slot="@ComponentNameSlotNames.NameOf(ComponentNameSlotTypes.SlotPropertyName)"`

      * Example: `data-slot="@TableHeaderCellSlotNames.NameOf(TableHeaderCellSlotTypes.SortIndicator)"`
* **Alpine Integration:** See `docs/agents/alpine.md` for the Alpine child-container convention if Alpine is used.
* **Accessibility:** Refer to `docs/agents/accessibility.md` for accessibility guidelines.
* **Localization:** Refer to `docs/agents/accessibility.md` for localization guidelines.

**SSR-only reminder (CRITICAL):**

* Do not add Blazor interactivity constructs to `.razor` markup (no `@on...`, no `@bind`, no interactive component state that depends on a Blazor circuit). Use Alpine/HTMX approaches per `docs/agents/alpine.md`.

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

* Start with `/// <summary>...</summary>` for the class.
* **All** public members get `<summary>` XML docs.
* Inherit from `RzComponent<TSlots>` or `RzAsChildComponent<TSlots>`.
* Define a `public sealed partial class Slots : ISlots` inside the component class for non-generic components.
* **All properties in the `Slots` class MUST be decorated with the `[Slot("kebab-case-name")]` attribute.** The name should match `shadcn/ui` conventions where applicable.
* For components inheriting from `RzAsChildComponent`, the `Base` slot's classes are merged onto the child element. The `[Slot(...)]` attribute is still required on the `Base` property in the `Slots` class.
* Define a `public static readonly TvDescriptor<...>` with all base, slot, and variant styles.
* Implement `protected override TvDescriptor<...> GetDescriptor() => Theme.ComponentName;`.
* Handle default localized strings for parameters like `AriaLabel` (`docs/agents/accessibility.md`).

**SSR-only reminder (CRITICAL):**

* Do not introduce Blazor-interactivity-oriented APIs (e.g., `EventCallback` meant for client-side interaction) as part of RizzyUI component design. Prefer semantic HTML + Alpine/HTMX patterns.

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

* Accept icons as `SvgIcon?`.
* Style the `<Blazicon>` using the source-generated `SlotClasses.Get...()` accessor.
* Add the mandatory `data-slot` attribute using the `SlotNames.NameOf(...)` helper.
* Add `aria-hidden="true"` if the icon is purely decorative.

