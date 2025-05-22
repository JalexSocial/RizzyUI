
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents the title section (defaults to <c>h3</c>) for an <see cref="RzAlert" /> component.
///     Its text color is determined by the parent alert's variant and the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzAlertTitle : RzComponent
{
    private string _variantTextClass = string.Empty;

    /// <summary> Gets the parent <see cref="RzAlert" /> component to determine the variant. </summary>
    [CascadingParameter] public RzAlert? AlertParent { get; set; }

    /// <summary> The content to be rendered inside the alert title (typically text). </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        
        if (string.IsNullOrEmpty(Element))
            Element = "h3"; // Default semantic level for an alert title within its context
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Get variant color class after AlertParent should be available
        _variantTextClass = Theme.RzAlertTitle.GetVariantTextColorCss(AlertParent?.Variant);
    }


    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzAlertTitle.Title, _variantTextClass);
    }
}