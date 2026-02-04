
using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders the visual indicator for a <see cref="RzCheckboxGroupItem"/>.
/// </summary>
public partial class CheckboxGroupItemIndicator : RzComponent<CheckboxGroupItemIndicator.Slots>
{
    [CascadingParameter] private ICheckboxGroupItem? ParentItem { get; set; }
    [CascadingParameter(Name = "ShowIndicators")] private bool ShowIndicators { get; set; } = true;

    /// <summary>
    /// Gets or sets custom content to display as the indicator when checked.
    /// If not provided, a default icon is used.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the icon to display when checked. Overrides the parent group's icon if set.
    /// </summary>
    [Parameter] public SvgIcon? CheckedIcon { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        ParentItem?.RegisterIndicator();
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CheckboxGroupItemIndicator;

    /// <summary>
    /// Defines the slots available for styling in the CheckboxGroupItemIndicator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the indicator's wrapper element.
        /// </summary>
        [Slot("indicator-wrapper")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the default checkmark icon.
        /// </summary>
        [Slot("indicator-icon")]
        public string? Icon { get; set; }

        /// <summary>
        /// The slot for the wrapper of custom indicator content.
        /// </summary>
        [Slot("custom-indicator")]
        public string? CustomContentWrapper { get; set; }
    }
}