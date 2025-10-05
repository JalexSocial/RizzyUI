
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// An interactive element that closes its parent <see cref="RzDialog"/>.
/// It can be rendered as a button or merge its behavior into a child element.
/// </summary>
public partial class DialogClose : RzAsChildComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDialog? ParentDialog { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDialog == null)
        {
            throw new InvalidOperationException($"{nameof(DialogClose)} must be used within an {nameof(RzDialog)}.");
        }
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = RootClass(),
            ["x-on:click"] = "closeModal",
            ["data-slot"] = "dialog-close"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes);
    }
}