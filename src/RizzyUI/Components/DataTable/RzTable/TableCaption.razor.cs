using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a caption (<c>caption</c>) for an <see cref="RzTable"/>.
/// </summary>
public partial class TableCaption : RzComponent<TableCaptionSlots>
{
    /// <summary>
    /// Gets or sets caption content.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "caption";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableCaptionSlots>, TableCaptionSlots> GetDescriptor() => Theme.TableCaption;
}
