using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Linq;

namespace RizzyUI;

/// <xmldoc>
/// Represents a group of checkbox items that support multiple selection.
/// </xmldoc>
public partial class CheckboxGroup<TValue> : RizzyComponent
{
    private static readonly string BaseStyle = "flex flex-wrap gap-4";

    /// <xmldoc>
    /// Gets or sets the selected values in the checkbox group.
    /// </xmldoc>
    [Parameter]
    public IList<TValue> Values { get; set; } = new List<TValue>();

    /// <xmldoc>
    /// Gets or sets the event callback when the selected values change.
    /// </xmldoc>
    [Parameter]
    public EventCallback<IList<TValue>> ValuesChanged { get; set; }

    /// <xmldoc>
    /// Gets or sets the expression for the bound value, used for validation.
    /// </xmldoc>
    [Parameter]
    public Expression<Func<IList<TValue>>>? For { get; set; }

    /// <xmldoc>
    /// Gets or sets the orientation of the checkbox group.
    /// </xmldoc>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <xmldoc>
    /// Gets or sets the child content to be rendered inside the checkbox group.
    /// </xmldoc>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <xmldoc>
    /// Determines whether the specified value is selected.
    /// </xmldoc>
    /// <param name="value">The value to check.</param>
    /// <returns>True if the value is selected; otherwise, false.</returns>
    public bool IsSelected(TValue value) =>
        Values.Any(x => EqualityComparer<TValue>.Default.Equals(x, value));

    /// <xmldoc>
    /// Toggles the selection state of the specified value.
    /// </xmldoc>
    /// <param name="value">The value to toggle.</param>
    /// <param name="isChecked">True to select the value; false to deselect.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task ToggleValueAsync(TValue value, bool isChecked)
    {
        if (isChecked)
        {
            if (!Values.Any(x => EqualityComparer<TValue>.Default.Equals(x, value)))
            {
                Values.Add(value);
            }
        }
        else
        {
            var existing = Values.FirstOrDefault(x => EqualityComparer<TValue>.Default.Equals(x, value));
            if (existing != null && Values.Contains(existing))
            {
                Values.Remove(existing);
            }
        }
        if (ValuesChanged.HasDelegate)
        {
            await ValuesChanged.InvokeAsync(Values);
        }
        StateHasChanged();
    }

    /// <xmldoc>
    /// Computes the root CSS class by merging default and orientation‑specific styles.
    /// </xmldoc>
    protected override string? RootClass()
    {
        string layoutClass = Orientation == Orientation.Horizontal
            ? "flex flex-row items-center gap-4"
            : "flex flex-col gap-2";
        return TwMerge.Merge(AdditionalAttributes, BaseStyle, layoutClass);
    }
}
