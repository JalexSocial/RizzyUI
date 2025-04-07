using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

// For Dictionary

namespace RizzyUI;

/// <xmldoc>
///     Represents a styled link component that renders an anchor (<c>a</c>) element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzLink : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter]
    protected RzTheme? CascadedTheme { get; set; }

    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject]
    private IOptions<RizzyUIConfig>? Config { get; set; }

    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Gets or sets the URL to which the link navigates. If null or empty, defaults to "#". </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary> Gets or sets whether the link should be underlined on hover and focus. Defaults to true. </summary>
    [Parameter]
    public bool Underline { get; set; } = true;

    /// <summary> Gets or sets the content to be displayed inside the link (e.g., text or icons). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Combines AdditionalAttributes with the href attribute. </summary>
    protected Dictionary<string, object> CombinedAttributes
    {
        get
        {
            var attributes = AdditionalAttributes ?? new Dictionary<string, object>();
            // Ensure Href is added or updated correctly
            attributes["href"] = string.IsNullOrEmpty(Href) ? "#" : Href;
            return attributes;
        }
    }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException(
                $"{GetType()} requires a cascading RzTheme or a default theme configured.");

        // The base element is handled by HtmlElement in the razor file
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzLink;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Link,
            Underline ? styles.UnderlineEnabled : "");
    }
}