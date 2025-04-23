
using Blazicons;
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace RizzyUI;

/// <xmldoc>
///     Represents a single link item within an <see cref="RzSidebarLinks" /> list. Can be a simple link,
///     a collapsible section header, or a non-collapsible header with nested items.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSidebarLinkItem : RzComponent
{
    private bool _hasChildren;

    /// <summary> Gets the parent <see cref="RzSidebarLinkItem" /> in a hierarchy, if any. </summary>
    [CascadingParameter]
    public RzSidebarLinkItem? Parent { get; set; }

    /// <summary> Gets or sets the Blazicon SVG icon to display for the link item. </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Gets or sets the title text of the link item. Required. </summary>
    [Parameter]
    [EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary> Gets or sets the URL to navigate to (used if not collapsible and not a header-only item). Defaults to "#". </summary>
    [Parameter]
    public string Href { get; set; } = "#";

    /// <summary> Gets or sets the target attribute for the link (_self, _blank, etc.). </summary>
    [Parameter]
    public string Target { get; set; } = "_self";

    /// <summary> Gets or sets the child content, typically nested <see cref="RzSidebarLinkItem" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets additional content to display after the title (e.g., badges). </summary>
    [Parameter]
    public RenderFragment? TrailerContent { get; set; }

    /// <summary>
    ///     Gets or sets a value indicating whether the link item acts as a collapsible section header. Defaults to
    ///     false.
    /// </summary>
    [Parameter]
    public bool Collapsible { get; set; }

    /// <summary> Gets or sets the initial collapsed state if <see cref="Collapsible" /> is true. Defaults to true. </summary>
    [Parameter]
    public bool Collapsed { get; set; } = true;

    /// <summary> Gets or sets a value indicating whether this link item contains child items. Set automatically by children. </summary>
    protected internal bool HasChildren
    {
        get => _hasChildren;
        set
        {
            if (_hasChildren != value)
            {
                _hasChildren = value;
                StateHasChanged();
            }
        }
    }

    /// <summary> Gets the unique ID for the collapsible button element. </summary>
    protected string ButtonId { get; private set; } = string.Empty;

    /// <summary> Gets the unique ID for the collapsible content element. </summary>
    protected string CollapseId { get; private set; } = string.Empty;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Collapsible)
        {
            var guid = IdGenerator.UniqueId("rzsb"); // Use new prefix
            ButtonId = $"rzbtn-{guid}";
            CollapseId = $"rzclps-{guid}";
        }

        Parent?.NotifyChildAdded(this); // Notify parent
    }

    /// <summary>
    ///     Called by child components to notify the parent that a child has been added.
    /// </summary>
    /// <param name="child">The child <see cref="RzSidebarLinkItem" /> being added.</param>
    internal void NotifyChildAdded(RzSidebarLinkItem child)
    {
        if (!HasChildren) HasChildren = true;
    }
}