
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The primary interactive element within a <see cref="SidebarMenuItem"/>. It can be rendered as a button
/// or, using the `AsChild` pattern, as another element like an anchor tag.
/// </summary>
public partial class SidebarMenuButton : RzAsChildComponent
{
    /// <summary>
    /// Gets or sets the content of the button, typically an icon and a text label. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets a value indicating whether this menu item is the currently active page.
    /// If true, it applies active styling and `aria-current="page"`. Defaults to false.
    /// </summary>
    [Parameter]
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the button.
    /// Defaults to <see cref="SidebarMenuButtonVariant.Default"/>.
    /// </summary>
    [Parameter]
    public SidebarMenuButtonVariant Variant { get; set; } = SidebarMenuButtonVariant.Default;

    /// <summary>
    /// Gets or sets the size of the button.
    /// Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = RootClass(),
            ["aria-current"] = IsActive ? "page" : null
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var styles = Theme.SidebarMenuButton;
        return TwMerge.Merge(
            AdditionalAttributes,
            styles.ButtonBase,
            styles.GetVariantCss(Variant),
            styles.GetSizeCss(Size)
        );
    }
}