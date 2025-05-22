
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a clickable button with customizable styling, variant, and size. Styling is handled by the active theme.
/// </summary>
public partial class RzButton : RzComponent
{
    /// <summary>
    /// Gets or sets the parent <see cref="RzButtonGroup"/> this component belongs to, if any.
    /// This is provided via a cascading parameter.
    /// </summary>
    [CascadingParameter]
    public RzButtonGroup? Group { get; set; }

    /// <summary>
    /// Gets or sets the accessible label for the button, used for screen readers.
    /// If not provided, it defaults to a localized value obtained from <see cref="RzComponent.Localizer"/>
    /// using the key "RzButton.AssistiveLabelDefault".
    /// </summary>
    [Parameter]
    public string? AssistiveLabel { get; set; }

    /// <summary>
    /// Gets or sets the visual style variant of the button (e.g., Primary, Secondary).
    /// Defaults to <see cref="ButtonVariant.Primary"/>.
    /// </summary>
    [Parameter]
    public ButtonVariant Variant { get; set; } = ButtonVariant.Primary;

    /// <summary>
    /// Gets or sets the size of the button.
    /// Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets a value indicating whether the button should have an outline style
    /// instead of a solid background. Defaults to false.
    /// </summary>
    [Parameter]
    public bool Outline { get; set; }

    /// <summary>
    /// Gets or sets the text label displayed on the button. This is used only if
    /// the <see cref="ChildContent"/> parameter is not provided. Defaults to an empty string.
    /// </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets a value indicating whether to enable the button's click animation
    /// (e.g., scaling effect on press). Defaults to true.
    /// </summary>
    [Parameter]
    public bool Animate { get; set; } = true;

    /// <summary>
    /// Gets or sets the optional content to be rendered inside the button element.
    /// If provided, this overrides the <see cref="Label"/> property.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the effective assistive label to be used for the `aria-label` attribute.
    /// It returns the value of the <see cref="AssistiveLabel"/> parameter if provided,
    /// otherwise it falls back to the localized default string identified by the key "RzButton.AssistiveLabelDefault".
    /// </summary>
    protected string EffectiveAssistiveLabel => AssistiveLabel ?? Localizer["RzButton.AssistiveLabelDefault"];

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        
        // Set the root HTML element for this component to 'button'.
        if (string.IsNullOrEmpty(Element))
            Element = "button";
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzButton;
        var groupStyles = Theme.RzButtonGroup;
        string groupSpecificClass = string.Empty;

        // Determine if this button is part of a group and apply specific styles
        if (Group != null)
        {
            var index = Group.Buttons.IndexOf(this);
            if (index == 0) // First button in the group
                groupSpecificClass = groupStyles.GroupFirst;
            else if (index == Group.Buttons.Count - 1) // Last button in the group
                groupSpecificClass = groupStyles.GroupLast;
            else // Middle button in the group
                groupSpecificClass = groupStyles.GroupMiddle;
        }

        // Merge all applicable CSS classes using Tailwind Merge
        return TwMerge.Merge(AdditionalAttributes, // Start with user-provided classes
            styles.Button,                        // Base button styles
            Outline ? styles.GetVariantOutlineCss(Variant) : styles.GetVariantCss(Variant), // Apply variant (solid or outline)
            Animate ? styles.Animated : "",       // Apply animation class if enabled
            styles.GetSizeCss(Size),              // Apply size class
            groupSpecificClass);                  // Apply group-specific class if applicable
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Register this button with its parent group, if it exists.
        Group?.AddButton(this);
    }
}