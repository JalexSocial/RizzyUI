
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The main content panel of a <see cref="RzDialog"/> that appears when triggered.
/// </summary>
public partial class DialogContent : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDialog? ParentDialog { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the dialog panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets whether to show the default close button in the top-right corner.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool ShowCloseButton { get; set; } = true;

    /// <summary>
    /// Gets or sets the size variant of the dialog, controlling its maximum width.
    /// Defaults to <see cref="ModalSize.Medium"/>.
    /// </summary>
    [Parameter]
    public ModalSize Size { get; set; } = ModalSize.Medium;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDialog == null)
        {
            throw new InvalidOperationException($"{nameof(DialogContent)} must be used within an {nameof(RzDialog)}.");
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var styles = Theme.RzDialog;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Dialog,
            styles.GetSizeCss(Size)
        );
    }
}