using System.Linq.Expressions;
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a group of checkbox items (<see cref="RzCheckboxGroupItem{TValue}" />) that support multiple selection.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCheckboxGroup<TValue> : RzComponent
{
    /// <summary> Gets or sets the selected values in the checkbox group. </summary>
    [Parameter]
    public IList<TValue> Values { get; set; } = new List<TValue>();

    /// <summary> Gets or sets the event callback when the selected values change. </summary>
    [Parameter]
    public EventCallback<IList<TValue>> ValuesChanged { get; set; }

    /// <summary> Gets or sets the expression for the bound value, used for validation. </summary>
    [Parameter]
    public Expression<Func<IList<TValue>>>? For { get; set; }

    /// <summary> Gets or sets the orientation of the checkbox group (Vertical or Horizontal). Defaults to Vertical. </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary> Gets or sets the child content, expected to be <see cref="RzCheckboxGroupItem{TValue}" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     Gets or sets the custom Blazicon SVG icon to display when a checkbox is checked. Defaults to
    ///     MdiIcon.CheckBold.
    /// </summary>
    [Parameter]
    public SvgIcon CheckedIcon { get; set; } = MdiIcon.CheckBold;

    /// <summary> Determines whether the specified value is currently selected in the group. </summary>
    /// <param name="value">The value to check.</param>
    /// <returns>True if the value is selected; otherwise, false.</returns>
    public bool IsSelected(TValue value)
    {
        return Values.Any(x => EqualityComparer<TValue>.Default.Equals(x, value));
    }

    /// <summary> Toggles the selection state of the specified value within the group. </summary>
    /// <param name="value">The value to toggle.</param>
    /// <param name="isChecked">The desired state (true to select, false to deselect).</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task ToggleValueAsync(TValue value, bool isChecked)
    {
        var changed = false;
        if (isChecked)
        {
            if (!Values.Any(x => EqualityComparer<TValue>.Default.Equals(x, value)))
            {
                Values.Add(value);
                changed = true;
            }
        }
        else
        {
            var existing = Values.FirstOrDefault(x => EqualityComparer<TValue>.Default.Equals(x, value));
            // Ensure existing is not null before checking Contains and removing
            if (existing != null && Values.Contains(existing))
            {
                var removed = Values.Remove(existing);
                if (removed) changed = true;
            }
        }

        if (changed && ValuesChanged.HasDelegate) await ValuesChanged.InvokeAsync(Values);
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzCheckboxGroup;
        return TwMerge.Merge(AdditionalAttributes, styles.Container, styles.GetOrientationCss(Orientation));
    }
}