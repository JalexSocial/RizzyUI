
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a group of related <see cref="DropdownMenuItem"/>s within <see cref="DropdownMenuContent"/>.
/// </summary>
public partial class DropdownMenuGroup : RzComponent<DropdownMenuGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "py-1"
    );

    /// <summary>
    /// Gets or sets the content of the group, typically <see cref="DropdownMenuItem"/>s. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuGroup;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}