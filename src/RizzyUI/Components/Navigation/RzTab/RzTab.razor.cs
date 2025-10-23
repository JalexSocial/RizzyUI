
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a single clickable tab button within an <see cref="RzTabStrip" />.
///     Interacts with the parent <see cref="RzTabs" /> component and Alpine.js to manage selection state.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTab : RzComponent<RzTab.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzTab component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    );

    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    [CascadingParameter]
    private RzTabStrip? TabStrip { get; set; }

    /// <summary>
    /// Gets or sets the unique name for this tab, which must match the `Name` of the corresponding `RzTabPanel`.
    /// </summary>
    [Parameter, EditorRequired]
    public required string Name { get; set; } = default!;

    /// <summary>
    /// Gets or sets the content to be displayed inside the tab button.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the lowercase version of the tab's name.
    /// </summary>
    protected string NameLower => Name?.ToLowerInvariant() ?? string.Empty;
    /// <summary>
    /// Gets the unique ID for the tab button element.
    /// </summary>
    protected string TabId => $"{NameLower}-tab";
    /// <summary>
    /// Gets the unique ID for the corresponding tab panel element.
    /// </summary>
    protected string PanelId => $"{NameLower}-panel";
    /// <summary>
    /// Gets the CSS class for the selected tab's text color.
    /// </summary>
    protected string SelectedTextColorClass =>
        Parent?.SelectedTabTextColor.ToTextClass() ?? Theme.Light.Primary.ToCssClassString("text");

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");

        if (TabStrip == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabStrip component.");

        Parent.AddTab(this);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTab;

    /// <summary>
    /// Defines the slots available for styling in the RzTab component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}