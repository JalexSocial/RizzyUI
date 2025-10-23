
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents the content panel associated with a specific <see cref="RzTab" />.
///     It becomes visible when its corresponding tab is selected. Controlled via Alpine.js.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTabPanel : RzComponent<RzTabPanel.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzTabPanel component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex-1 outline-none"
    );

    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    /// <summary>
    /// Gets or sets the unique name for this panel, which must match the `Name` of the corresponding `RzTab`.
    /// </summary>
    [Parameter, EditorRequired]
    public string Name { get; set; } = default!;

    /// <summary>
    /// Gets or sets the content to be displayed inside the tab panel when active.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the lowercase version of the panel's name.
    /// </summary>
    protected string NameLower => Name?.ToLowerInvariant() ?? string.Empty;
    /// <summary>
    /// Gets the unique ID for the corresponding tab button element.
    /// </summary>
    protected string TabId => $"{NameLower}-tab";
    /// <summary>
    /// Gets the unique ID for the tab panel element.
    /// </summary>
    protected string PanelId => $"{NameLower}-panel";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTabPanel;

    /// <summary>
    /// Defines the slots available for styling in the RzTabPanel component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main panel container.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the inner content wrapper.
        /// </summary>
        public string? InnerContainer { get; set; }
    }
}