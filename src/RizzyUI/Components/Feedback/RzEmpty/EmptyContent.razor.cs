
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A container for supplementary content within an <see cref="RzEmpty"/> component, such as action buttons.
/// </summary>
public partial class EmptyContent : RzComponent<EmptyContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the EmptyContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance"
    );

    /// <summary>
    /// Gets or sets the content to be rendered.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.EmptyContent;

    /// <summary>
    /// Defines the slots available for styling in the EmptyContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}