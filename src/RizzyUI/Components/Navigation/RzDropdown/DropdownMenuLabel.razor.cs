
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a non-interactive label or heading within a <see cref="DropdownMenuContent"/>.
/// </summary>
public partial class DropdownMenuLabel : RzComponent<DropdownMenuLabel.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuLabel component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "px-2 py-1.5 text-sm font-medium text-foreground"
    );

    /// <summary>
    /// Gets or sets the content of the label. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuLabel;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuLabel component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}