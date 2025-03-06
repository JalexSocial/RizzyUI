using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a clickable button with customizable styling, variant, and size. Interactivity is managed via external Alpine.js data objects.
/// </summary>
public partial class Button : RizzyComponent
{
    private static readonly string BaseStyle = "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-theme font-medium tracking-wide text-center transition hover:opacity-75 active:opacity-100 hover:shadow-sm disabled:opacity-75 disabled:cursor-not-allowed";

    /// <summary>
    /// Cascaded ButtonGroup this component belongs to (optional)
    /// </summary>
    [CascadingParameter] public ButtonGroup? Group { get; set; }

    /// <summary>
    /// Gets or sets the accessible label for the button, used by assistive technologies.
    /// </summary>
    [Parameter]
    public string AssistiveLabel { get; set; } = "Action Button";
    /// <summary>
    /// Button variation (primary, secondary, etc)
    /// </summary>
    [Parameter]
    public ButtonVariant Variant { get; set; } = ButtonVariant.Primary;

    /// <summary>
    /// Button size
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Makes the button to have the outlines.
    /// </summary>
    [Parameter]
    public bool Outline { get; set; }

    /// <summary>
    /// Label for button (if ChildContent not provided)
    /// </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Enable click animation (default: true)
    /// </summary>
    [Parameter]
    public bool Animate { get; set; } = true;

    /// <summary>
    /// Child content for the button
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        this.Element = "button";
    }

    /// <inheritdoc />>
    protected override string? RootClass()
    {
        string trailer = string.Empty;
        if (Group != null)
        {
            var idx = Group.Buttons.IndexOf(this);

            if (idx == 0)
            {
                trailer = " rounded-none rounded-l-lg";
            }
            else if (idx == Group.Buttons.Count - 1)
            {
                trailer = " rounded-none rounded-r-lg border-l-0";
            }
            else
            {
                trailer = " rounded-none border-l-0";
            }
        }

        return TwMerge.Merge(AdditionalAttributes, BaseStyle, 
	        Outline ? GetButtonOutlineVariantCss(Variant) : GetButtonVariantCss(Variant), 
            Animate ? "transform active:scale-90 motion-reduce:transition-none transition-transform" : "",
            GetButtonSizeCss(Size), 
	        trailer);
    }

    /// <summary>
    /// Adds this button to a group if it is part of one
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (Group != null)
        {
            Group.AddButton(this);
        }
    }

    /// <summary>
    /// Gets the CSS classes associated with the specified button variant.
    /// </summary>
    /// <param name="variant">The <see cref="ButtonVariant"/> enum value representing the button variant.</param>
    /// <returns>A string containing the CSS classes for the specified button variant.</returns>
    /// <exception cref="ArgumentOutOfRangeException">
    /// Thrown when an invalid <see cref="ButtonVariant"/> value is provided.
    /// </exception>
    protected static string GetButtonVariantCss(ButtonVariant variant)
    {
        return variant switch
        {
            ButtonVariant.Primary => "bg-primary text-on-primary focus-visible:outline-primary   dark:focus-visible:outline-primary-dark",
            ButtonVariant.Secondary => "bg-secondary text-on-secondary focus-visible:outline-secondary   dark:focus-visible:outline-secondary-dark",
            ButtonVariant.Alternate => "bg-surface-alt text-on-surface focus-visible:outline-surface-alt   dark:focus-visible:outline-surface-dark-alt",
            ButtonVariant.Inverse => "bg-surface-dark text-on-surface-dark focus-visible:outline-surface dark:bg-surface dark:text-on-surface-strong dark:focus-visible:outline-surface",
            ButtonVariant.Information => "bg-info text-onInfo focus-visible:outline-info dark:bg-info dark:text-onInfo dark:focus-visible:outline-info",
            ButtonVariant.Danger => "bg-danger text-on-danger focus-visible:outline-danger dark:bg-danger dark:text-on-danger dark:focus-visible:outline-danger",
            ButtonVariant.Warning => "bg-warning text-on-warning focus-visible:outline-warning dark:bg-warning dark:text-on-warning dark:focus-visible:outline-warning",
            ButtonVariant.Success => "bg-success text-on-success focus-visible:outline-success dark:bg-success dark:text-on-success dark:focus-visible:outline-success",
            ButtonVariant.Ghost => "bg-transparent text-on-surface focus-visible:outline-none",
            _ => throw new ArgumentOutOfRangeException(nameof(variant), variant, null)
        };
    }

    /// <summary>
    /// Gets the CSS classes associated with the outline style of the specified button variant.
    /// </summary>
    /// <param name="variant">The <see cref="ButtonVariant"/> enum value representing the button variant.</param>
    /// <returns>A string containing the CSS classes for the outline style of the specified button variant.</returns>
    /// <exception cref="ArgumentOutOfRangeException">
    /// Thrown when an invalid <see cref="ButtonVariant"/> value is provided.
    /// </exception>
    protected static string GetButtonOutlineVariantCss(ButtonVariant variant)
    {
        return variant switch
        {
            ButtonVariant.Primary => "bg-transparent border border-primary text-primary focus-visible:outline-primary   dark:focus-visible:outline-primary-dark",
            ButtonVariant.Secondary => "bg-transparent border border-secondary text-secondary focus-visible:outline-secondary   dark:focus-visible:outline-secondary-dark",
            ButtonVariant.Alternate => "bg-transparent border border-outline text-outline focus-visible:outline-outline   dark:focus-visible:outline-outline-dark",
            ButtonVariant.Inverse => "bg-transparent border border-on-surface-strong text-on-surface-strong focus-visible:outline-on-surface-strong   dark:focus-visible:outline-on-surface-dark-strong",
            ButtonVariant.Information => "bg-transparent border border-info text-info focus-visible:outline-info dark:border-info dark:text-info dark:focus-visible:outline-info",
            ButtonVariant.Danger => "bg-transparent border border-danger text-danger focus-visible:outline-danger dark:border-danger dark:text-danger dark:focus-visible:outline-danger",
            ButtonVariant.Warning => "bg-transparent border border-warning text-warning focus-visible:outline-warning dark:border-warning dark:text-warning dark:focus-visible:outline-warning",
            ButtonVariant.Success => "bg-transparent border border-success text-success focus-visible:outline-success dark:border-success dark:text-success dark:focus-visible:outline-success",
            ButtonVariant.Ghost => "bg-transparent border text-on-surface hover:opacity-75 focus-visible:outline-none ",
            _ => throw new ArgumentOutOfRangeException(nameof(variant), variant, null)
        };
    }

    /// <summary>
    /// Gets the CSS classes associated with the specified size for buttons.
    /// </summary>
    /// <param name="size">The <see cref="Size"/> enum value representing the button size.</param>
    /// <returns>A string containing the CSS classes for the specified button size.</returns>
    /// <exception cref="ArgumentOutOfRangeException">
    /// Thrown when an invalid <see cref="Size"/> value is provided.
    /// </exception>
    protected static string GetButtonSizeCss(Size size)
    {
        return size switch
        {
            Size.ExtraSmall => "px-2 py-1 text-sm",
            Size.Small => "px-3 py-2 text-sm",
            Size.Medium => "px-4 py-2 text-md",
            Size.Large => "px-6 py-3 text-md",
            Size.ExtraLarge => "px-8 py-4 text-md",
            _ => throw new ArgumentOutOfRangeException(nameof(size), size, null)
        };
    }

}
