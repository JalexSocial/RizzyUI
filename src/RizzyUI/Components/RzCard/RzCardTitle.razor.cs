using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// Represents the main title within an <see cref="RzCardHeader"/>. Typically renders as an H3 element.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzCardTitle : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> The text or content to be rendered as the card title. </summary>
	[Parameter] public RenderFragment? ChildContent { get; set; }

	/// <inheritdoc/>
    protected override void OnInitialized()
	{
		base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");

		this.Element = "h3"; // Default element for a title
	}

	/// <inheritdoc/>
	protected override string? RootClass() =>
		TwMerge.Merge(AdditionalAttributes, Theme.RzCardTitle.Title);
}

