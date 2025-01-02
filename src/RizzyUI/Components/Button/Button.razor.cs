using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

public partial class Button : RizzyComponent
{
    private static readonly string BaseStyle = "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded font-medium tracking-wide text-center transition hover:opacity-75 active:opacity-100 hover:shadow-sm disabled:opacity-75 disabled:cursor-not-allowed";

    [CascadingParameter] public ButtonGroup? Group { get; set; }

    [Parameter] public string AssistiveLabel { get; set; } = "Action Button";

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
    /// Child content for the button
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        this.Element = "button";
    }

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

        return TwMerge.Merge(AdditionalAttributes, BaseStyle, Outline ? GetButtonOutlineVariantCss(Variant) : GetButtonVariantCss(Variant), GetButtonSizeCss(Size), trailer);
    }

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
            ButtonVariant.Primary => "bg-primary text-onPrimary focus-visible:outline-primary dark:bg-primaryDark dark:text-onPrimaryDark dark:focus-visible:outline-primaryDark",
            ButtonVariant.Secondary => "bg-secondary text-onSecondary focus-visible:outline-secondary dark:bg-secondaryDark dark:text-onSecondaryDark dark:focus-visible:outline-secondaryDark",
            ButtonVariant.Alternate => "bg-surfaceAlt text-onSurface focus-visible:outline-surfaceAlt dark:bg-surfaceAltDark dark:text-onSurfaceDark dark:focus-visible:outline-surfaceAltDark",
            ButtonVariant.Inverse => "bg-surfaceDark text-onSurfaceDark focus-visible:outline-surface dark:bg-surface dark:text-onSurfaceStrong dark:focus-visible:outline-surface",
            ButtonVariant.Information => "bg-info text-onInfo focus-visible:outline-info dark:bg-info dark:text-onInfo dark:focus-visible:outline-info",
            ButtonVariant.Danger => "bg-danger text-onDanger focus-visible:outline-danger dark:bg-danger dark:text-onDanger dark:focus-visible:outline-danger",
            ButtonVariant.Warning => "bg-warning text-onWarning focus-visible:outline-warning dark:bg-warning dark:text-onWarning dark:focus-visible:outline-warning",
            ButtonVariant.Success => "bg-success text-onSuccess focus-visible:outline-success dark:bg-success dark:text-onSuccess dark:focus-visible:outline-success",
            ButtonVariant.Ghost => "bg-transparent text-onSurface focus-visible:outline-none",
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
            ButtonVariant.Primary => "bg-transparent border border-primary text-primary focus-visible:outline-primary dark:border-primaryDark dark:text-primaryDark dark:focus-visible:outline-primaryDark",
            ButtonVariant.Secondary => "bg-transparent border border-secondary text-secondary focus-visible:outline-secondary dark:border-secondaryDark dark:text-secondaryDark dark:focus-visible:outline-secondaryDark",
            ButtonVariant.Alternate => "bg-transparent border border-outline text-outline focus-visible:outline-outline dark:border-outlineDark dark:text-outlineDark dark:focus-visible:outline-outlineDark",
            ButtonVariant.Inverse => "bg-transparent border border-onSurfaceStrong text-onSurfaceStrong focus-visible:outline-onSurfaceStrong dark:border-onSurfaceStrongDark dark:text-onSurfaceStrongDark dark:focus-visible:outline-onSurfaceStrongDark",
            ButtonVariant.Information => "bg-transparent border border-info text-info focus-visible:outline-info dark:border-info dark:text-info dark:focus-visible:outline-info",
            ButtonVariant.Danger => "bg-transparent border border-danger text-danger focus-visible:outline-danger dark:border-danger dark:text-danger dark:focus-visible:outline-danger",
            ButtonVariant.Warning => "bg-transparent border border-warning text-warning focus-visible:outline-warning dark:border-warning dark:text-warning dark:focus-visible:outline-warning",
            ButtonVariant.Success => "bg-transparent border border-success text-success focus-visible:outline-success dark:border-success dark:text-success dark:focus-visible:outline-success",
            ButtonVariant.Ghost => "bg-transparent border text-onSurface hover:opacity-75 focus-visible:outline-none dark:text-onSurfaceDark",
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
