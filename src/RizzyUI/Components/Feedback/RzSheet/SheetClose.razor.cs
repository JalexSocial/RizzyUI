
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// An interactive element that closes its parent <see cref="RzSheet"/>.
/// It can be rendered as a button or merge its behavior into a child element.
/// </summary>
public partial class SheetClose : RzAsChildComponent<SheetClose.Slots>
{
    /// <summary>
    /// Defines the default styling for the SheetClose component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex"
    );

    /// <summary>
    /// Gets the parent <see cref="RzSheet"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzSheet? ParentSheet { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSheet == null)
        {
            throw new InvalidOperationException($"{nameof(SheetClose)} must be used within an {nameof(RzSheet)}.");
        }
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["x-on:click"] = "close",
            ["data-slot"] = "sheet-close"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.SheetClose;

    /// <summary>
    /// Defines the slots available for styling in the SheetClose component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}