using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a group of <see cref="RzButton" /> components displayed together,
///     often with adjusted styling for adjacent borders and corners.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzButtonGroup : RzComponent
{
    /// <summary> Internal list that holds the buttons added to the group. </summary>
    private readonly List<RzButton> _buttons = new();

    /// <summary> Gets the read-only list of buttons contained in this button group. </summary>
    public List<RzButton> Buttons => _buttons;

    /// <summary>
    ///     The child content to be rendered inside the button group. Typically includes <see cref="RzButton" />
    ///     components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzButtonGroup.Container);
    }

    /// <summary>
    ///     Adds an <see cref="RzButton" /> to the button group if it is not already present.
    ///     Called internally by child buttons.
    /// </summary>
    /// <param name="button">The <see cref="RzButton" /> instance to add to the group.</param>
    internal void AddButton(RzButton button)
    {
        if (!_buttons.Contains(button)) _buttons.Add(button);
        // No need to call StateHasChanged here as the button rendering itself will handle its classes based on index
    }
}