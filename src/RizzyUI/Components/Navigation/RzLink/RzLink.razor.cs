
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

// For Dictionary

namespace RizzyUI;

/// <xmldoc>
///     Represents a styled link component that renders an anchor (<c>a</c>) element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzLink : RzComponent
{
    /// <summary> Gets or sets the URL to which the link navigates. If null or empty, defaults to "#". </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Gets or sets the color of the link. Defaults to <see cref="SemanticColor.Primary" />.
    /// </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.Primary; 

    /// <summary> Gets or sets whether the link should be underlined on hover and focus. Defaults to true. </summary>
    [Parameter]
    public bool Underline { get; set; } = true;

    /// <summary> Gets or sets the content to be displayed inside the link (e.g., text or icons). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Sets default element to <c>a</c> for the link component.
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "a"; // Set the root element tag to <a> for links
    }

    /// <summary>
    /// Invoked when a component's parameters have been set or updated.
    /// Updates the <c>Href</c> parameter to a default value if it has not been specified.
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        Href ??= "#";
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzLink;
        return TwMerge.Merge(AdditionalAttributes, styles.Link, Color.ToTextClass(), Underline ? styles.UnderlineEnabled : "");
    }
}