using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a breadcrumb navigation component that displays a list of navigation links.
///     Styling is determined by the active <see cref="RzTheme" />. Child <see cref="RzBreadcrumbItem" />
///     components register themselves with this parent.
/// </xmldoc>
public partial class RzBreadcrumb : RzComponent
{
    /// <summary> Gets the list of breadcrumb items registered with this breadcrumb component. </summary>
    protected readonly List<RzBreadcrumbItem> Items = new();

    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter]
    protected RzTheme? CascadedTheme { get; set; }

    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject]
    private IOptions<RizzyUIConfig>? Config { get; set; }

    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Specifies the Blazicon SVG icon to use as a separator between items. Defaults to ChevronRight. </summary>
    [Parameter]
    public SvgIcon Separator { get; set; } = MdiIcon.ChevronRight;

    /// <summary> Child content for the breadcrumb component, should contain <see cref="RzBreadcrumbItem" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the wrapping ordered list (ol) element. </summary>
    protected string ListClass => Theme.RzBreadcrumb.List;

    /// <summary> Gets the computed CSS classes for the individual list item (li) element. </summary>
    protected string ItemClass => Theme.RzBreadcrumbItem.ListItem; // Get from Item styles

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException(
                $"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.Container);
    }

    /// <summary>
    ///     Registers a breadcrumb item with this breadcrumb component. Called by child items.
    /// </summary>
    /// <param name="item">The breadcrumb item to register.</param>
    internal void RegisterItem(RzBreadcrumbItem item)
    {
        if (!Items.Contains(item)) // Prevent duplicate registration
        {
            Items.Add(item);
            InvokeAsync(StateHasChanged); // Update UI when items are added
        }
    }
}