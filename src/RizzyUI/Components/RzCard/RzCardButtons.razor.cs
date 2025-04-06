using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// A container specifically for placing buttons within an <see cref="RzCardHeader"/> or <see cref="RzCardFooter"/>.
/// Provides appropriate layout styling based on the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzCardButtons : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> The buttons or other action elements to be rendered within this container. </summary>
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
		TwMerge.Merge(AdditionalAttributes, Theme.RzCardButtons.ButtonsContainer);
}

