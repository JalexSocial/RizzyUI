using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Linq;
using Blazicons;

namespace RizzyUI;

/// <summary>
/// Represents a group of checkbox items that support multiple selection.
/// </summary>
public partial class CheckboxGroup<TValue> : RzComponent
{
    private static readonly string BaseStyle = "flex flex-wrap gap-4";

    /// <summary>
    /// Gets or sets the selected values in the checkbox group.
    /// </summary>
    [Parameter]
    public IList<TValue> Values { get; set; } = new List<TValue>();

    /// <summary>
    /// Gets or sets the event callback when the selected values change.
    /// </summary>
    [Parameter]
    public EventCallback<IList<TValue>> ValuesChanged { get; set; }

    /// <summary>
    /// Gets or sets the expression for the bound value, used for validation.
    /// </summary>
    [Parameter]
    public Expression<Func<IList<TValue>>>? For { get; set; }

    /// <summary>
    /// Gets or sets the orientation of the checkbox group.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    /// Gets or sets the child content to be rendered inside the checkbox group.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the custom icon to display when a checkbox is checked.
    /// Defaults to MdiIcon.Check.
    /// </summary>
    [Parameter]
    public SvgIcon CheckedIcon { get; set; } = MdiIcon.CheckBold;

    /// <summary>
    /// Determines whether the specified value is selected.
    /// </summary>
    /// <param name="value">The value to check.</param>
    /// <returns>True if the value is selected; otherwise, false.</returns>
    public bool IsSelected(TValue value) =>
        Values.Any(x => EqualityComparer<TValue>.Default.Equals(x, value));

    /// <summary>
    /// Toggles the selection state of the specified value.
    /// </summary>
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

    /// <summary>
    /// Computes the root CSS class by merging default and orientation‑specific styles.
    /// </summary>
    protected override string? RootClass()
    {
        string layoutClass = Orientation == Orientation.Horizontal
            ? "flex flex-row items-center gap-4"
            : "flex flex-col gap-2";
        return TwMerge.Merge(AdditionalAttributes, BaseStyle, layoutClass);
    }
}
