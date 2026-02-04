
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A control that allows the user to toggle between checked and unchecked states.
/// </summary>
public partial class RzSwitch : InputBase<bool, RzSwitchSlots>, IHasRzSwitchStylingProperties
{
    /// <summary>
    /// Gets or sets the accessible label for the switch.
    /// If not set, a default localized label will be applied.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzSwitch.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSwitch.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzSwitchSlots>, RzSwitchSlots> GetDescriptor() => Theme.RzSwitch;
}