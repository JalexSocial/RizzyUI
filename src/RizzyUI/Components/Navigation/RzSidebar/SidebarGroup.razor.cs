
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A structural component for grouping related items within a <see cref="SidebarContent"/>.
/// It provides an accessible grouping by associating its content with a <see cref="SidebarGroupLabel"/>.
/// </summary>
public partial class SidebarGroup : RzComponent
{
    /// <summary>
    /// Gets the unique ID for the label associated with this group, used for `aria-labelledby`.
    /// </summary>
    public string LabelId { get; } = IdGenerator.UniqueId("rzsb-grouplabel-");

    /// <summary>
    /// Gets or sets the content of the group, which should include a <see cref="SidebarGroupLabel"/>
    /// and a <see cref="SidebarGroupContent"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarGroup.Group);
    }
}