using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;

namespace RizzyUI;

public partial class AccordionSection : RizzyComponent
{
	// Generate a unique ID for this section.
	private string SectionId { get; } = IdGenerator.UniqueId("accsec");
	private string ButtonId => $"accordion-button-{SectionId}";
	private string ContentId => $"accordion-content-{SectionId}";

	private static readonly string ButtonBaseStyle =
		"flex w-full items-center justify-between gap-4 bg-surface-alt p-4 text-left " +
		"underline-offset-2 hover:bg-surface-alt/75 focus-visible:bg-surface-alt/75 " +
		"focus-visible:underline focus-visible:outline-hidden dark:bg-surface-dark-alt " +
		"dark:hover:bg-surface-dark-alt/75 dark:focus-visible:bg-surface-dark-alt/75 " +
		"text-on-surface dark:text-on-surface-dark font-medium";

	private static readonly string ContentBaseStyle =
		"p-4 text-sm sm:text-base text-pretty";

	/// <summary>
	/// The title for this accordion section.
	/// </summary>
	[Parameter]
	public string Title { get; set; } = string.Empty;

    /// <summary>
    /// The default state for this section
    /// </summary>
	[Parameter]
	public bool Collapsed { get; set; } = true;

	/// <summary>
	/// The content displayed when the section is open.
	/// </summary>
	[Parameter]
	public RenderFragment? ChildContent { get; set; }

	private string? ButtonClass => TwMerge.Merge(AdditionalAttributes, ButtonBaseStyle);
	private string ContentClass => ContentBaseStyle;
}
