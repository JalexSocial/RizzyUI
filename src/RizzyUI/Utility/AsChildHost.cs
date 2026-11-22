using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace RizzyUI;

/// <summary>
/// Renders <see cref="Content"/>'s single root with <see cref="Attributes"/> merged into it, the same
/// way <see cref="RzAsChildComponent"/> components do. For components that support <c>AsChild</c>
/// but cannot derive from <see cref="RzAsChildComponent"/> without changing their public descriptor
/// type (<see cref="RzButton"/>, Summit SF-018).
/// </summary>
internal sealed class AsChildHost : RzAsChildComponent
{
    /// <summary>The child content; it must have exactly one root element, component or markup.</summary>
    [Parameter, EditorRequired] public RenderFragment? Content { get; set; }

    /// <summary>The attributes to merge into the child (its own attributes win; classes merge).</summary>
    [Parameter, EditorRequired] public Dictionary<string, object?> Attributes { get; set; } = new();

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AsChild = true;
    }

    /// <inheritdoc />
    protected override RenderFragment? GetAsChildContent() => Content;

    /// <inheritdoc />
    protected override Dictionary<string, object?> GetComponentAttributes() => Attributes;

    /// <inheritdoc />
    protected override void BuildRenderTree(RenderTreeBuilder builder) => builder.AddContent(0, RenderAsChild());
}
