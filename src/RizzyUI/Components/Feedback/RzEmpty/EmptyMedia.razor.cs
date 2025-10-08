
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for an icon or image within an <see cref="EmptyHeader"/>.
/// </summary>
public partial class EmptyMedia : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered, typically an icon or image.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the media container.
    /// Defaults to <see cref="EmptyMediaVariant.Default"/>.
    /// </summary>
    [Parameter]
    public EmptyMediaVariant Variant { get; set; } = EmptyMediaVariant.Default;

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzEmpty.GetMediaCss(Variant));
    }
}