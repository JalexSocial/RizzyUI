using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the body (<c>tbody</c>) of an <see cref="RzTable"/>.
/// </summary>
public partial class TableBody : RzComponent<TableBodySlots>
{
    /// <summary>
    /// Gets or sets the parent table component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the row content rendered within the table body.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "tbody";
        }

        if (ParentRzTable == null)
        {
            throw new InvalidOperationException($"{GetType().Name} must be used within an RzTable.");
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableBodySlots>, TableBodySlots> GetDescriptor() => Theme.TableBody;
}
