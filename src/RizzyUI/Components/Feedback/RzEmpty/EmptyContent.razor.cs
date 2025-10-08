
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for supplementary content within an <see cref="RzEmpty"/> component, such as action buttons.
/// </summary>
public partial class EmptyContent : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzEmpty.Content);
    }
}