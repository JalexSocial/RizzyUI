using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// Gives the RizzyUI components inside it deterministic ids: <c>{Prefix}-1</c>, <c>{Prefix}-2</c>, ...
/// in render order, so the same markup always renders the same ids. Use it for content that is
/// re-rendered and swapped (an htmx fragment that replaces itself, or a morph swap that matches
/// elements by id) and for snapshot tests. Ids derived from a component's id (dialog titles, tab
/// panels and so on) follow it. Components with an explicit <c>Id</c> keep it.
/// </summary>
/// <remarks>
/// Outside a scope, ids are unique per process but differ on every render (RZUI-061). The prefix must
/// be unique on the page: two scopes with the same prefix render the same ids.
/// </remarks>
public partial class RzIdScope : ComponentBase
{
    private int _next;

    /// <summary>
    /// The id prefix, unique on the page (for example <c>"cart"</c>). It must be a valid HTML id
    /// fragment: no whitespace.
    /// </summary>
    [Parameter, EditorRequired]
    public string Prefix { get; set; } = default!;

    /// <summary>The content whose components get scoped ids.</summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        if (string.IsNullOrWhiteSpace(Prefix) || Prefix.Any(char.IsWhiteSpace))
        {
            throw new InvalidOperationException($"{nameof(RzIdScope)} requires a {nameof(Prefix)} without whitespace.");
        }
    }

    /// <summary>Returns the next id in this scope.</summary>
    internal string NextId() => $"{Prefix}-{++_next}";
}
