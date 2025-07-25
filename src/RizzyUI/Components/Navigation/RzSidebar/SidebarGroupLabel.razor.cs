
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Renders a heading for a <see cref="SidebarGroup"/>. It can also function as a trigger for a
/// collapsible section when using the `AsChild` pattern.
/// </summary>
public partial class SidebarGroupLabel : RzAsChildComponent
{
    /// <summary>
    /// Gets the parent <see cref="SidebarGroup"/> to link via `aria-labelledby`.
    /// </summary>
    [CascadingParameter]
    protected SidebarGroup? ParentGroup { get; set; }

    /// <summary>
    /// Gets or sets the content of the label, typically text. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentGroup == null)
        {
            throw new InvalidOperationException($"{nameof(SidebarGroupLabel)} must be used within a {nameof(SidebarGroup)}.");
        }
        Element = "h3";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = ParentGroup?.LabelId,
            ["class"] = RootClass()
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarGroupLabel.Label);
    }
}