
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for prepending or appending content to an input within an `RzInputGroup`.
/// </summary>
public partial class InputGroupAddon : RzComponent<InputGroupAddonSlots>, IHasInputGroupAddonStylingProperties
{
    private string _effectiveInpoutGroupAddonAlign = "inline-start";

    /// <summary>
    /// Gets or sets the content to be rendered inside the addon.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the alignment and position of the addon relative to the input.
    /// Defaults to <see cref="InputGroupAddonAlign.InlineStart"/>.
    /// </summary>
    [Parameter]
    public InputGroupAddonAlign Align { get; set; } = InputGroupAddonAlign.InlineStart;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<InputGroupAddonSlots>, InputGroupAddonSlots> GetDescriptor() => Theme.InputGroupAddon;
}

/// <summary>
/// Specifies the alignment for an InputGroupAddon.
/// </summary>
public enum InputGroupAddonAlign
{
    /// <summary>
    /// Aligned to the start of the input, inside the border.
    /// </summary>
    InlineStart,
    /// <summary>
    /// Aligned to the end of the input, inside the border.
    /// </summary>
    InlineEnd,
    /// <summary>
    /// Aligned above the input.
    /// </summary>
    BlockStart,
    /// <summary>
    /// Aligned below the input.
    /// </summary>
    BlockEnd
}