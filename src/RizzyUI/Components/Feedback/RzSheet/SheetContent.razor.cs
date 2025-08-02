
// src/RizzyUI/Components/Feedback/RzSheet/SheetContent.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The main panel of the sheet that slides into view. It contains the sheet's content,
/// header, and footer, along with a default close button.
/// </summary>
public partial class SheetContent : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzSheet"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzSheet? ParentSheet { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the sheet panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the side from which the sheet will appear.
    /// Defaults to <see cref="SheetSide.Right"/>.
    /// </summary>
    [Parameter]
    public SheetSide Side { get; set; } = SheetSide.Right;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSheet == null)
        {
            throw new InvalidOperationException($"{nameof(SheetContent)} must be used within an {nameof(RzSheet)}.");
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var styles = Theme.RzSheet;
        return TwMerge.Merge(
            AdditionalAttributes,
            styles.Content,
            styles.GetSideCss(Side)
        );
    }
}