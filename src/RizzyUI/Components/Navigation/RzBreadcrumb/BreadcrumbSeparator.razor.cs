
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list item (`&lt;li&gt;`) that renders a separator between breadcrumb items.
/// It defaults to a chevron icon but can be customized with child content.
/// </summary>
public partial class BreadcrumbSeparator : RzComponent<BreadcrumbSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the BreadcrumbSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center",
        slots: new()
        {
            [s => s.Icon] = "size-3.5"
        }
    );

    /// <summary>
    /// Gets or sets the custom content to be used as a separator, overriding the default icon.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "li";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.BreadcrumbSeparator;

    /// <summary>
    /// Defines the slots available for styling in the BreadcrumbSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root `li` element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The icon slot for the default separator icon.
        /// </summary>
        public string? Icon { get; set; }
    }
}