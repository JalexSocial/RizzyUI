
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component that renders a <label> element with styling for form inputs, enhancing accessibility and consistency.
/// </summary>
public partial class Label : RzComponent<Label.Slots>
{
    /// <summary>
    /// Defines the default styling for the Label component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the label.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the `for` attribute of the label, which should match the `id` of a form control.
    /// </summary>
    [Parameter]
    public string? For { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "label";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.Label;

    /// <summary>
    /// Defines the slots available for styling in the Label component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("label")]
        public string? Base { get; set; }
    }
}