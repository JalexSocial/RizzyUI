using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;
using System.Collections.Generic;

namespace RizzyUI;

/// <xmldoc>
/// Represents a group of <see cref="RzButton"/> components displayed together,
/// often with adjusted styling for adjacent borders and corners.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzButtonGroup : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Internal list that holds the buttons added to the group. </summary>
    private readonly List<RzButton> _buttons = new();

    /// <summary> Gets the read-only list of buttons contained in this button group. </summary>
    public IReadOnlyList<RzButton> Buttons => _buttons.AsReadOnly();

    /// <summary> The child content to be rendered inside the button group. Typically includes <see cref="RzButton"/> components. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzButtonGroup.Container);

    /// <summary>
    /// Adds an <see cref="RzButton"/> to the button group if it is not already present.
    /// Called internally by child buttons.
    /// </summary>
    /// <param name="button">The <see cref="RzButton"/> instance to add to the group.</param>
    internal void AddButton(RzButton button)
    {
        if (!_buttons.Contains(button))
        {
            _buttons.Add(button);
            // No need to call StateHasChanged here as the button rendering itself will handle its classes based on index
        }
    }
}

