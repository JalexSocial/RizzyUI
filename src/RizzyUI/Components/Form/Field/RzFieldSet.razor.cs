
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component that groups a set of related form fields, typically within a form. It renders as a `fieldset` element.
/// </summary>
public partial class RzFieldSet : RzComponent<RzFieldSet.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzFieldSet component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the fieldset, which can include a `FieldLegend` and multiple `FieldGroup` or `Field` components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "fieldset";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzFieldSet;

    /// <summary>
    /// Defines the slots available for styling in the RzFieldSet component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("field-set")]
        public string? Base { get; set; }
    }
}