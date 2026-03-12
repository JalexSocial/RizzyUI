using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a header cell in an <see cref="RzTable"/>.
/// </summary>
public partial class TableHeaderCell : RzComponent<TableHeaderCellSlots>
{
    /// <summary>
    /// Gets or sets the content displayed in the header cell.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "th";
        }

        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes.TryAdd("scope", "col");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableHeaderCellSlots>, TableHeaderCellSlots> GetDescriptor() => Theme.TableHeaderCell;
}
