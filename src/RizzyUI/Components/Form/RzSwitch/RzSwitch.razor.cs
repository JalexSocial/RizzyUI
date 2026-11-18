
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A control that allows the user to toggle between checked and unchecked states.
/// </summary>
public partial class RzSwitch : InputBase<bool, RzSwitchSlots>, IHasRzSwitchStylingProperties
{
    /// <summary>
    /// Gets or sets an accessible label for a switch that has no visible label. Prefer a visible
    /// label (<c>FieldLabel</c> or <c>&lt;label for&gt;</c>): an <c>aria-label</c> replaces it for
    /// screen readers, which is why none is rendered by default.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzSwitchSlots>, RzSwitchSlots> GetDescriptor() => Theme.RzSwitch;
}