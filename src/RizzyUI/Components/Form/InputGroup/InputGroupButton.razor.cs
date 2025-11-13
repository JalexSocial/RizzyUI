
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A button specifically styled for use within an `InputGroupAddon`.
/// </summary>
public partial class InputGroupButton : RzComponent<InputGroupButtonSlots>, IHasInputGroupButtonStylingProperties
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the button.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual style variant of the button.
    /// Defaults to <see cref="ButtonVariant.Ghost"/>.
    /// </summary>
    [Parameter]
    public ButtonVariant Variant { get; set; } = ButtonVariant.Ghost;

    /// <summary>
    /// Gets or sets a value indicating whether the button should have an outline style. Defaults to false.
    /// </summary>
    [Parameter]
    public bool Outline { get; set; }

    /// <summary>
    /// Gets or sets the size of the button, specific to the input group context.
    /// Defaults to <see cref="InputGroupButtonSize.ExtraSmall"/>.
    /// </summary>
    [Parameter]
    public InputGroupButtonSize Size { get; set; } = InputGroupButtonSize.ExtraSmall;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<InputGroupButtonSlots>, InputGroupButtonSlots> GetDescriptor() => Theme.InputGroupButton;
}

/// <summary>
/// Specifies the size for an InputGroupButton.
/// </summary>
public enum InputGroupButtonSize
{
    /// <summary>
    /// Extra small button size.
    /// </summary>
    ExtraSmall,
    /// <summary>
    /// Small button size.
    /// </summary>
    Small,
    /// <summary>
    /// Extra small icon-only button size.
    /// </summary>
    IconExtraSmall,
    /// <summary>
    /// Small icon-only button size.
    /// </summary>
    IconSmall
}