using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The main container for the sidebar, which renders as an <c><aside></c> element.
/// It consumes state from a parent <see cref="RzSidebarProvider"/> to manage its appearance and behavior.
/// </summary>
public partial class Sidebar : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzSidebarProvider"/> which manages the state for this sidebar.
    /// </summary>
    [CascadingParameter]
    protected RzSidebarProvider? ParentProvider { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the sidebar's navigation area. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the side of the screen where the sidebar will appear.
    /// Defaults to <see cref="SidebarSide.Left"/>.
    /// </summary>
    [Parameter]
    public SidebarSide Side { get; set; } = SidebarSide.Left;

    /// <summary>
    /// Gets or sets the variant of the sidebar, which controls its overall layout behavior.
    /// Defaults to <see cref="SidebarVariant.Default"/>.
    /// </summary>
    [Parameter]
    public SidebarVariant Variant { get; set; } = SidebarVariant.Default;

    /// <summary>
    /// Gets or sets the ARIA label for the sidebar navigation, providing context for screen readers.
    /// If not set, it defaults to a localized "Sidebar navigation".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentProvider == null)
        {
            throw new InvalidOperationException($"{nameof(Sidebar)} must be used within an {nameof(RzSidebarProvider)}.");
        }
        Element = "aside";
        AriaLabel ??= Localizer["RzSidebar.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSidebar.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var styles = Theme.Sidebar;
        return TwMerge.Merge(
            AdditionalAttributes,
            styles.SidebarBase,
            styles.GetVariantCss(Variant)
        );
    }
}