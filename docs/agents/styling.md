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

* **A Styling Interface:** `public interface IHas{ComponentName}StylingProperties` containing only the properties needed for variants.
* **The Slots Class:** `public sealed partial class {ComponentName}Slots : ISlots` with all `[Slot]` decorated properties.
* **A Static Styles Class:** `public static class {ComponentName}Styles` containing the `DefaultDescriptor`.

**Example: `Styling/TableHeaderCellStyles.cs`**

````csharp
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
````

