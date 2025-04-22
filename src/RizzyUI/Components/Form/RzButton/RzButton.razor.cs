using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

// Add this

namespace RizzyUI;

/// <xmldoc>
///     Represents a clickable button with customizable styling, variant, and size. Styling is handled by the active theme.
/// </xmldoc>
public partial class RzButton : RzComponent
{
    /// <summary> Cascaded RzButtonGroup this component belongs to (optional) </summary>
    [CascadingParameter]
    public RzButtonGroup? Group { get; set; }

    /// <summary> Gets or sets the accessible label for the button. </summary>
    [Parameter]
    public string AssistiveLabel { get; set; } = "Action Button";

    /// <summary> Button variation (primary, secondary, etc). </summary>
    [Parameter]
    public ButtonVariant Variant { get; set; } = ButtonVariant.Primary;

    /// <summary> Button size. </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary> Makes the button to have the outlines. </summary>
    [Parameter]
    public bool Outline { get; set; }

    /// <summary> Label for button (if ChildContent not provided). </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary> Enable click animation (default: true). </summary>
    [Parameter]
    public bool Animate { get; set; } = true;

    /// <summary> Child content for the button. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        Element = "button";
    }

    /// <inheritdoc />
    /// >
    protected override string? RootClass()
    {
        var styles = Theme.RzButton;
        var groupStyles = Theme.RzButtonGroup; // Get group styles
        var groupSpecificClass = string.Empty;

        if (Group != null)
        {
            var idx = Group.Buttons.IndexOf(this);
            if (idx == 0)
                groupSpecificClass = groupStyles.GroupFirst;
            else if (idx == Group.Buttons.Count - 1)
                groupSpecificClass = groupStyles.GroupLast;
            else
                groupSpecificClass = groupStyles.GroupMiddle;
        }

        return TwMerge.Merge(AdditionalAttributes,
            styles.Button,
            Outline ? styles.GetVariantOutlineCss(Variant) : styles.GetVariantCss(Variant),
            Animate ? styles.Animated : "",
            styles.GetSizeCss(Size),
            groupSpecificClass);
    }

    /// <inheritdoc />
    /// >
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Add to group if part of one
        Group?.AddButton(this);
    }
}