
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the trigger buttons of an <see cref="RzTabs"/> component.
/// </summary>
public partial class TabsList : RzComponent<TabsList.Slots>
{
    /// <summary>
    /// Defines the default styling for the TabsList component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"
    );

    /// <summary>
    /// The content of the list, which should be a series of <see cref="TabsTrigger"/> components.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// The accessible name for the tab list. Defaults to a localized "Tabs".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// The orientation of the tab list, affecting keyboard navigation.
    /// Defaults to <see cref="Orientation.Horizontal"/>.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Horizontal;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
        AriaLabel ??= Localizer["RzTabs.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzTabs.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.TabsList;

    /// <summary>
    /// Defines the slots available for styling in the TabsList component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("tabs-list")]
        public string? Base { get; set; }
    }
}