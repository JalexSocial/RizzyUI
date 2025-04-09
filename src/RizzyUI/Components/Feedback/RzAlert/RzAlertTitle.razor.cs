using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Represents the title section (<c>h3</c>) for an <see cref="RzAlert"/> component.
/// Its text color is determined by the parent alert's variant and the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzAlertTitle : RzComponent
{
    /// <summary> Gets the parent <see cref="RzAlert"/> component to determine the variant. </summary>
    [CascadingParameter] public RzAlert? AlertParent { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>

    private string _variantTextClass = string.Empty;

    /// <summary> The content to be rendered inside the alert title (typically text). </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        Element = "h3";
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
         base.OnParametersSet();
         // Get variant color class after AlertParent should be available
         _variantTextClass = Theme.RzAlertTitle.GetVariantTextColorCss(AlertParent?.Variant);
    }


    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzAlertTitle.Title, _variantTextClass);
}