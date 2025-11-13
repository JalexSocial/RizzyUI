
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for grouping multiple `Field` components together, providing consistent spacing.
/// </summary>
public partial class RzFieldGroup : RzComponent<RzFieldGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzFieldGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the group, typically one or more `Field` components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.FieldGroup;

    /// <summary>
    /// Defines the slots available for styling in the RzFieldGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("field-group")]
        public string? Base { get; set; }
    }
}