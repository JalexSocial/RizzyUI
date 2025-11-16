
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides the default styling descriptor for the CheckboxGroupItemIndicator component.
/// </summary>
public static class CheckboxGroupItemIndicatorStyles
{
    /// <summary>
    /// The default TvDescriptor for the CheckboxGroupItemIndicator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<CheckboxGroupItemIndicator.Slots>, CheckboxGroupItemIndicator.Slots> DefaultDescriptor = new(
        @base: "relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background group-has-[.peer:focus-visible]:ring-2 group-has-[.peer:focus-visible]:ring-ring group-has-[.peer:focus-visible]:ring-offset-2 group-has-[.peer:checked]:border-primary group-has-[.peer:checked]:bg-primary",
        slots: new()
        {
            [s => s.Icon] = "pointer-events-none size-3.5 text-primary-foreground opacity-0 transition-opacity group-has-[.peer:checked]:opacity-100",
            [s => s.CustomContentWrapper] = "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-has-[.peer:checked]:opacity-100"
        }
    );
}